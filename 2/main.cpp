#include <random>
#include <iostream>
#include <utility>
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
    const ull e = 65537; // commonly used value
    const ull d = mod_inverse(e, phi_n);
    return {{e, n}, {d, p, q}};
}

int main()
{
    std::srand(time(nullptr));
    return 0;
}
