from flask import Flask, jsonify, request, send_from_directory
import subprocess
import os

app = Flask(__name__, static_folder='../frontend', static_url_path='')

PRODUCTS = [
    {"id": 1, "name": "T-shirt", "price": 299.0, "desc": "Comfort cotton tee"},
    {"id": 2, "name": "Sneakers", "price": 1999.0, "desc": "Sporty shoes"},
    {"id": 3, "name": "Mug", "price": 199.0, "desc": "Ceramic mug"}
]

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/products')
def get_products():
    return jsonify(PRODUCTS)

@app.route('/api/checkout', methods=['POST'])
def checkout():
    data = request.get_json() or {}
    cart = data.get('cart', [])
    coupon = data.get('coupon', '')

    subtotal = 0.0
    for item in cart:
        pid = item.get('id')
        qty = float(item.get('qty', 1))
        prod = next((p for p in PRODUCTS if p['id'] == pid), None)
        if prod is None:
            return jsonify({"error": f"product id {pid} not found"}), 400
        subtotal += prod['price'] * qty

    exe_name = './discount' if os.name != 'nt' else 'discount.exe'
    exe_path = os.path.join(os.path.dirname(__file__), os.path.basename(exe_name))

    if not os.path.exists(exe_path):
        return jsonify({"error": "discount helper not compiled. Compile discount.cpp first."}), 500

    try:
        proc = subprocess.run(
            [exe_path, str(subtotal), coupon],
            check=True,
            capture_output=True,
            text=True,
            timeout=5
        )
        final_total_str = proc.stdout.strip()
        final_total = float(final_total_str)
    except subprocess.CalledProcessError as e:
        return jsonify({"error": "discount helper error", "stderr": e.stderr}), 500
    except Exception as e:
        return jsonify({"error": "failed to run discount helper", "detail": str(e)}), 500

    return jsonify({"subtotal": round(subtotal, 2), "total": round(final_total, 2)})

if __name__ == '__main__':
    app.run(debug=True)
