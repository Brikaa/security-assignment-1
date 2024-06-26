use base64::{prelude::BASE64_STANDARD, Engine};
use rand::Rng;
use std::{env, fs, process::exit};

const PC_1: [u8; 56] = [
    57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60,
    52, 44, 36, 63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22, 14, 6, 61, 53, 45, 37, 29,
    21, 13, 5, 28, 20, 12, 4,
];

const PC_2: [u8; 48] = [
    14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2, 41, 52,
    31, 37, 47, 55, 30, 40, 51, 45, 33, 48, 44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32,
];

const SHIFT_SCHEDULE: [u8; 16] = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

const IP: [u8; 64] = [
    58, 50, 42, 34, 26, 18, 10, 2, 60, 52, 44, 36, 28, 20, 12, 4, 62, 54, 46, 38, 30, 22, 14, 6,
    64, 56, 48, 40, 32, 24, 16, 8, 57, 49, 41, 33, 25, 17, 9, 1, 59, 51, 43, 35, 27, 19, 11, 3, 61,
    53, 45, 37, 29, 21, 13, 5, 63, 55, 47, 39, 31, 23, 15, 7,
];

const E_BIT: [u8; 48] = [
    32, 1, 2, 3, 4, 5, 4, 5, 6, 7, 8, 9, 8, 9, 10, 11, 12, 13, 12, 13, 14, 15, 16, 17, 16, 17, 18,
    19, 20, 21, 20, 21, 22, 23, 24, 25, 24, 25, 26, 27, 28, 29, 28, 29, 30, 31, 32, 1,
];

const S1: [[u64; 16]; 4] = [
    [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
    [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
    [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
    [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13],
];

const S2: [[u64; 16]; 4] = [
    [15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
    [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
    [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
    [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9],
];

const S3: [[u64; 16]; 4] = [
    [10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
    [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
    [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
    [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12],
];

const S4: [[u64; 16]; 4] = [
    [7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
    [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
    [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
    [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14],
];

const S5: [[u64; 16]; 4] = [
    [2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
    [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
    [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
    [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3],
];

const S6: [[u64; 16]; 4] = [
    [12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
    [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
    [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
    [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13],
];

const S7: [[u64; 16]; 4] = [
    [4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
    [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
    [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
    [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12],
];

const S8: [[u64; 16]; 4] = [
    [13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
    [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
    [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
    [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11],
];

const P: [u8; 32] = [
    16, 7, 20, 21, 29, 12, 28, 17, 1, 15, 23, 26, 5, 18, 31, 10, 2, 8, 24, 14, 32, 27, 3, 9, 19,
    13, 30, 6, 22, 11, 4, 25,
];

const IP_INV: [u8; 64] = [
    40, 8, 48, 16, 56, 24, 64, 32, 39, 7, 47, 15, 55, 23, 63, 31, 38, 6, 46, 14, 54, 22, 62, 30,
    37, 5, 45, 13, 53, 21, 61, 29, 36, 4, 44, 12, 52, 20, 60, 28, 35, 3, 43, 11, 51, 19, 59, 27,
    34, 2, 42, 10, 50, 18, 58, 26, 33, 1, 41, 9, 49, 17, 57, 25,
];

fn apply<const N: usize>(original_no_bits: u8, table: [u8; N], data: u64) -> u64 {
    let mut new_data = 0_u64;
    for i in 0..table.len() {
        let masked = data & (1 << (original_no_bits - table[i]));
        new_data |= (masked >> (original_no_bits - table[i])) << (table.len() - i - 1);
    }
    new_data
}

fn circular_shl(data: u64, i: u8) -> u64 {
    ((data << i) | (data >> (28 - i))) & ((1 << 28) - 1)
}

fn create_keys(k: u64) -> [u64; 16] {
    let k_plus = apply(64, PC_1, k);

    let mut cp = (k_plus & 0b0000000011111111111111111111111111110000000000000000000000000000) >> 28;
    let mut dp = k_plus & 0b0000000000000000000000000000000000001111111111111111111111111111;

    let mut keys = [0_u64; 16];
    for i in 1..=16 {
        cp = circular_shl(cp, SHIFT_SCHEDULE[i - 1]);
        dp = circular_shl(dp, SHIFT_SCHEDULE[i - 1]);
        keys[i - 1] = apply(56, PC_2, (cp << 28) | dp);
    }

    keys
}

fn s(data: u64) -> u64 {
    let mut new_data = 0_u64;
    let mut j = 28;
    let mut s_idx = 0;
    let s_arr = [S1, S2, S3, S4, S5, S6, S7, S8];
    for i in (5..=47).rev().step_by(6) {
        let row = ((data & (1 << i)) >> (i - 1)) | ((data & (1 << (i - 5))) >> (i - 5));
        let col = ((data & (1 << (i - 1))) >> (i - 4))
            | ((data & (1 << (i - 2))) >> (i - 4))
            | ((data & (1 << (i - 3))) >> (i - 4))
            | ((data & (1 << (i - 4))) >> (i - 4));
        new_data |= s_arr[s_idx][row as usize][col as usize] << j;
        j -= 4;
        s_idx += 1;
    }

    new_data
}

fn encrypt_block(keys: &[u64; 16], m: u64) -> u64 {
    let ip = apply(64, IP, m);
    let l0 = (ip & 0b1111111111111111111111111111111100000000000000000000000000000000) >> 32;
    let r0 = ip & 0b0000000000000000000000000000000011111111111111111111111111111111;

    let mut lp = l0;
    let mut rp = r0;
    for i in 1..=16 {
        let s_result = s(keys[i - 1] ^ apply(32, E_BIT, rp));
        let f_result = apply(32, P, s_result);
        let ln = rp;
        let rn = lp ^ f_result;
        lp = ln;
        rp = rn;
    }

    apply(64, IP_INV, (rp << 32) | lp)
}

fn chunk_to_block(chunk: &[u8]) -> u64 {
    let mut block = 0_u64;
    for i in 1..=8 {
        block |= (chunk[i - 1] as u64) << (64 - i * 8);
    }

    block
}

fn encrypt_message_bytes(padding: bool, keys: &[u64; 16], message_bytes: &[u8]) -> Vec<u8> {
    let chunks = message_bytes.chunks_exact(8);
    let mut remainder = chunks.remainder().to_vec();
    let mut message_blocks: Vec<u64> = Vec::new();
    for chunk in chunks {
        message_blocks.push(chunk_to_block(chunk));
    }

    if padding {
        // PKCS#5 padding
        let padding_len = 8 - (remainder.len() as u8);
        for _ in 1..=padding_len {
            remainder.push(padding_len);
        }
        assert_eq!(remainder.len(), 8);
        message_blocks.push(chunk_to_block(&remainder));
    }

    let mut encrypted_blocks: Vec<u64> = Vec::new();
    for block in message_blocks {
        encrypted_blocks.push(encrypt_block(keys, block));
    }

    let mut encrypted_bytes: Vec<u8> = Vec::new();
    for block in encrypted_blocks {
        let mut mask = 0b1111111100000000000000000000000000000000000000000000000000000000;
        let mut mask_no = 1;
        while mask != 0 {
            encrypted_bytes.push(((block & mask) >> (64 - (mask_no * 8))).try_into().unwrap());
            mask >>= 8;
            mask_no += 1;
        }
    }

    encrypted_bytes
}

fn encrypt_message(keys: &[u64; 16], message: &str) -> Vec<u8> {
    encrypt_message_bytes(true, keys, message.as_bytes())
}

fn decrypt_bytes(keys: &[u64; 16], message_bytes: &[u8]) -> Result<String, ()> {
    let mut reversed = keys.clone();
    reversed.reverse();
    let mut decrypted = encrypt_message_bytes(false, &reversed, message_bytes);
    let padding_len = *decrypted.last().unwrap();
    for _ in 1..=padding_len {
        decrypted.pop().unwrap();
    }
    match String::from_utf8(decrypted) {
        Ok(res) => Ok(res),
        Err(_) => Err(()),
    }
}

fn usage() -> String {
    let args: Vec<String> = env::args().collect();
    format!(
        "Usage:
    - {} encrypt file_path
    - {} decrypt file_path key",
        args[0], args[0]
    )
}
fn main() {
    let args: Vec<String> = env::args().collect();
    let op = args.get(1).expect(usage().as_str());
    let file_path = args.get(2).expect(usage().as_str());
    if op == "encrypt" {
        let key = rand::thread_rng().gen();
        let keys = &create_keys(key);
        let message = fs::read_to_string(&file_path)
            .expect(format!("Could not read from: {}", file_path).as_str());
        let encrypted = encrypt_message(keys, &message);
        let encoded = BASE64_STANDARD.encode(encrypted);
        let encrypted_file_path = file_path.clone() + ".enc";
        fs::write(&encrypted_file_path, encoded).expect("Failed to write to file");
        println!("Wrote the ciphertext in: {}", encrypted_file_path);
        println!("Key: {}", key);
    } else if op == "decrypt" {
        let encoded = fs::read_to_string(&file_path)
            .expect(format!("Could not read from: {}", file_path).as_str());
        let key: u64 = (args.get(3).expect(usage().as_str()))
            .parse()
            .expect("Could not parse the given key");
        let encrypted = BASE64_STANDARD
            .decode(encoded)
            .expect(format!("Could not decode the message in the file: {}", file_path).as_str());
        let decrypted = decrypt_bytes(&create_keys(key), &encrypted)
            .expect(format!("Failed to decrypt using the given key: {}", key).as_str());
        let decrypted_file_path = file_path.clone() + ".txt";
        fs::write(&decrypted_file_path, decrypted).expect("Failed to write to file");
        println!("Wrote the plain text in: {}", decrypted_file_path);
    } else {
        eprintln!("Invalid operation: {}", op);
        exit(1);
    }
}
