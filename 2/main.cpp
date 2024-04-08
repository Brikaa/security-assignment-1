#include <random>
#include <iostream>
#include <utility>
#include <string>
#include <vector>
#include <sstream>

struct PublicKey
{
    long long e;
    long long n;
};

struct PrivateKey
{
    long long d;
    long long p;
    long long q;
};

bool is_prime(const long long no)
{
    for (long long i = 2; i * i < no; ++i)
        if (no % i == 0)
            return false;
    return true;
}

// returns x, y where ax + by = gcd(a, b)
std::pair<long long, long long> bezout(long long a, long long b)
{
    if (a == 0)
        return {0, 1};
    auto [x, y] = bezout(b % a, a);
    return {y - (b / a) * x, x};
}

long long mod_inverse(long long e, long long phi_n)
{
    auto [x, _] = bezout(e, phi_n);
    // since e * x + phi_n * y = gcd(e, phi_n)
    // ∴ e * x + phi_n * y = 1
    // ∴ e*x % phi_n + phi_n*y % phi_n = 1 % phi_n
    // ∴ e*x % phi_n = 1
    // ∴ x is our mod inverse (d)
    // We want positive x
    return (x % phi_n + phi_n) % phi_n;
}

long long generate_prime()
{
    while (true)
    {
        const int no = std::rand() | 1; // generate odd number
        if (is_prime(no))
            return no;
    }
}

std::pair<PublicKey, PrivateKey> generate_public_private_key_pair()
{
    const long long p = generate_prime();
    const long long q = generate_prime();
    const long long n = p * q;
    const long long phi_n = (p - 1) * (q - 1);
    const long long e = 65537; // commonly used value
    const long long d = mod_inverse(e, phi_n);
    return {{e, n}, {d, p, q}};
}

long long multiply_mod(long long a, long long b, long long mod)
{
    // 8*3 = 2*4*b = 2*2*2*b
    // 9*3 = b + 2*4*b = b + 2*2*2*b
    long long res = 0;
    while (a != 1)
    {
        if (a % 2 == 1)
        {
            res = (res + b) % mod;
            --a;
        }
        b = (b + b) % mod;
        a /= 2;
    }
    return (res + b) % mod;
}

long long power_mod(long long base, long long exponent, long long mod)
{
    // 2 ** 8 = ((2 ** 2) ** 2) ** 2
    // 2 ** 9 = 2 * ((2 ** 2) ** 2) ** 2
    long long res = 1;
    while (exponent != 1)
    {
        if (exponent % 2 == 1)
        {
            res = multiply_mod(res, base, mod);
            --exponent;
        }
        base = multiply_mod(base, base, mod);
        exponent /= 2;
    }
    return multiply_mod(res, base, mod);
}

long long encrypt(long long m, long long e, long long n)
{
    return power_mod(m, e, n);
}

long long decrypt(long long c, long long d, long long p, long long q)
{
    return power_mod(c, d, p * q);
}

std::vector<long long> encrypt_message(const std::string message, PublicKey key)
{
    std::vector<long long> res;
    for (auto c : message)
        res.push_back(encrypt(c, key.e, key.n));
    return res;
}

std::string decrypt_message(const std::vector<long long> cipher, PrivateKey key)
{
    std::string res = "";
    for (auto c : cipher)
    {
        long long d = decrypt(c, key.d, key.p, key.q);
        res += d;
    }
    return res;
}

int main()
{
    std::cerr << "1. Generate keys\n2. Encrypt a message\n3. Decrypt a message\n";
    char choice;
    std::cin >> choice;
    if (choice == '1')
    {
        std::srand(time(nullptr));
        auto [pub, priv] = generate_public_private_key_pair();
        std::cout << "Private key: d: " << priv.d << " p: " << priv.p << " q: " << priv.q << '\n';
        std::cout << "Public key: e: " << pub.e << " n: " << pub.n << '\n';
    }
    else if (choice == '2')
    {
        std::cerr << "Message:\n";
        std::string message;
        std::cin.ignore();
        std::getline(std::cin, message);

        long long e, n;
        std::cerr << "e:\n";
        std::cin >> e;
        std::cerr << "n:\n";
        std::cin >> n;

        auto encrypted = encrypt_message(message, {e, n});
        std::cout << "Encrypted bytes: ";
        for (auto b : encrypted)
            std::cout << b << ' ';
        std::cout << '\n';
    }
    else if (choice == '3')
    {
        std::cerr << "Message bytes separated by spaces: \n";
        std::vector<long long> encrypted;
        std::string bs;
        std::cin.ignore();
        std::getline(std::cin, bs);
        std::stringstream s(bs);
        long long byte;
        while (s >> byte)
        {
            encrypted.push_back(byte);
        }
        long long d, p, q;
        std::cerr << "d:\n";
        std::cin >> d;
        std::cerr << "p:\n";
        std::cin >> p;
        std::cerr << "q:\n";
        std::cin >> q;
        std::cout << "Decrypted: " << decrypt_message(encrypted, {d, p, q}) << '\n';
    }
    return 0;
}
