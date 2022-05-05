const md5 = require("md5");

const gravatar = (email) => {
  const hash = md5(email);
  return `https://www.gravatar.com/avatar/${hash}.jpg?d=retro`;
};

module.exports = gravatar;
