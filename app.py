from flask import Flask, render_template, send_from_directory

app = Flask(__name__)

# Ruta principal
@app.route('/')
def index():
    return render_template('index.html')

# Servir modelos estáticos (para face-api.js)
@app.route('/static/models/<path:filename>')
def model_files(filename):
    return send_from_directory('static/models', filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
    #app.run(debug=True)
