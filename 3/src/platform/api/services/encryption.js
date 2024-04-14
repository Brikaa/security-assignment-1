const { createCipheriv, createDecipheriv, scryptSync, randomFillSync } = require('crypto');

const algorithm = 'aes-192-cbc';
const password = sails.config.encryption.password;
const salt = 'salt';

const encrypt = (plaintext) => {
    const key = scryptSync(password, salt, 24);
    const iv = randomFillSync(new Uint8Array(16));

    const cipher = createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString() + '.' + encrypted;
};

const decrypt = (value) => {
    const key = scryptSync(password, salt, 24);
    const [iv_str, encrypted] = value.split('.');
    const iv = Uint8Array.from(iv_str.split(','));
    const decipher = createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

module.exports.create_encrypted_field = (name, datatype) => ({
    type: datatype,
    get() {
        const value = this.getDataValue(name);
        if (value) return decrypt(value);
    },
    set(value) {
        this.setDataValue(name, encrypt(value));
    }
});
