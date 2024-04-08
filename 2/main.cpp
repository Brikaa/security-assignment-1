#include <random>
#include <iostream>
#include <utility>
#include <string>
#include <vector>
typedef unsigned long long ull;
typedef unsigned int ui;

struct PublicKey
{
    ull e;
    ull n;
};

struct PrivateKey
{
    ull d;
    ull p;
    ull q;
};

bool is_prime(const ull no)
{
    for (ull i = 2; i * i < no; ++i)
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

ull mod_inverse(ull e, ull phi_n)
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

ull generate_prime()
{
    while (true)
    {
        const ui no = std::rand() | 1; // generate odd number
        if (is_prime(no))
            return no;
    }
}

std::pair<PublicKey, PrivateKey> generate_public_private_key_pair()
{
    const ull p = generate_prime();
    const ull q = generate_prime();
    const ull n = p * q;
    const ull phi_n = (p - 1) * (q - 1);
    std::cerr << "phi_n: " << phi_n << '\n';
    const ull e = 65537; // commonly used value
    const ull d = mod_inverse(e, phi_n);
    return {{e, n}, {d, p, q}};
}

ull multiply_mod(ull a, ull b, ull mod)
{
    // 8*3 = 2*4*b = 2*2*2*b
    // 9*3 = b + 2*4*b = b + 2*2*2*b
    ull res = 0;
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

ull power_mod(ull base, ull exponent, ull mod)
{
    // 2 ** 8 = ((2 ** 2) ** 2) ** 2
    // 2 ** 9 = 2 * ((2 ** 2) ** 2) ** 2
    ull res = 1;
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

ull encrypt(ull m, ull e, ull n)
{
    return power_mod(m, e, n);
}

ull decrypt(ull c, ull d, ull p, ull q)
{
    return power_mod(c, d, p * q);
}

std::vector<ull> encrypt_message(const std::string message, PublicKey key)
{
    std::vector<ull> res;
    for (auto c : message)
        res.push_back(encrypt(c, key.e, key.n));
    return res;
}

std::string decrypt_message(const std::vector<ull> cipher, PrivateKey key)
{
    std::string res = "";
    for (auto c : cipher)
    {
        ull d = decrypt(c, key.d, key.p, key.q);
        std::cout << d << '\n';
        res += d;
    }
    return res;
}

int main()
{
    std::srand(time(nullptr));
    auto [pub, priv] = generate_public_private_key_pair();
    std::string message = "A";
    std::cout << "Message: " << message << '\n';
    auto encrypted = encrypt_message(message, pub);
    std::cerr << "A: " << (ull)'A' << '\n';
    std::cerr << "e: " << pub.e << " n: " << pub.n << '\n';
    std::cerr << "d: " << priv.d << " p: " << priv.p << " q: " << priv.q << '\n';
    for (auto b : encrypted)
        std::cerr << "enc: " << b << ' ';
    std::cerr << '\n';
    std::cout << "Decrypted: " << decrypt_message(encrypted, priv) << '\n';
    // std::cout << power_mod(2737252505083884131, 855606654899892609, 1455041561ll * 1928481367ll);
    return 0;
}
