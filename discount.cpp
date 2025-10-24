#include <iostream>
#include <iomanip>
#include <string>
#include <cstdlib>
using namespace std;

int main(int argc, char** argv) {
    if (argc < 2) {
        cerr << "Usage: discount <subtotal> [COUPON]" << endl;
        return 1;
    }
    double subtotal = 0.0;
    try {
        subtotal = stod(argv[1]);
    } catch (...) {
        cerr << "Bad input. Provide a valid number for subtotal." << endl;
        return 2;
    }
    string coupon = "";
    if (argc >= 3) coupon = argv[2];

    double discount_pct = 0.0;
    if (subtotal >= 500) discount_pct += 15.0;
    else if (subtotal >= 200) discount_pct += 10.0;
    else if (subtotal >= 100) discount_pct += 5.0;

    if (coupon == "SAVE10") discount_pct += 10.0;
    else if (coupon == "FREESHIP") discount_pct += 2.0;

    if (discount_pct > 40.0) discount_pct = 40.0;

    double discounted = subtotal * (1.0 - discount_pct / 100.0);

    double shipping = 0.0;
    if (subtotal < 50) shipping = 10.0;
    else if (subtotal < 100) shipping = 5.0;

    double final_total = discounted + shipping;

    cout << fixed << setprecision(2) << final_total << "\n";
    return 0;
}
