'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = authMiddleware;
const KEY_PREFIX = 'RENDERER_ACCESS_KEY';
const validKeys = {};

// Global key
if (process.env[KEY_PREFIX]) validKeys.global = process.env[KEY_PREFIX];

// Labeled keys
Object.keys(process.env).filter(k => k.startsWith(KEY_PREFIX + '_')).filter(k => process.env[k].length > 0).forEach(k => validKeys[k.replace(KEY_PREFIX + '_', '').toLowerCase()] = process.env[k]);

if (Object.keys(validKeys).length === 0) throw new Error('No access key defined!');

/**
 * Simple token auth middleware
 */
function authMiddleware(req, res, next) {
  const sentKey = req.query.access_key;
  const key = Object.keys(validKeys).filter(k => validKeys[k] === sentKey);
  if (!sentKey || key.length === 0) return res.sendStatus(403);

  req.keyLabel = key[0];
  next();
}