const { scrypt, randomFill, createCipheriv, createDecipheriv } = require('crypto');

const algorithm = 'aes-192-cbc';
const password = sails.config.encryption.password;
const salt = 'salt';

module.exports.encrypt = (plaintext) => {
    return new Promise((resolve, reject) => {
        scrypt(password, salt, 24, (err, key) => {
            if (err) reject(err);
            randomFill(new Uint8Array(16), (err, iv) => {
                if (err) reject(err);

                const cipher = createCipheriv(algorithm, key, iv);

                let encrypted = cipher.update(plaintext, 'utf8', 'hex');
                encrypted += cipher.final('hex');
                resolve(iv.toString() + '.' + encrypted);
            });
        });
    });
};

module.exports.decrypt = (value) => {
    return new Promise((resolve, reject) => {
        scrypt(password, salt, 24, (err, key) => {
            if (err) reject(err);
            const [iv_str, encrypted] = value.split('.');
            const iv = Uint8Array.from(iv_str.split(','));
            const decipher = createDecipheriv(algorithm, key, iv);
            let decrypted = decipher.update(encrypted, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            resolve(decrypted);
        });
    });
};
