from flask import Flask
from flask_cors import CORS
from config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)
    
    # Register blueprints
    from routes.auth import auth_bp
    from routes.products import products_bp  # Add this import
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(products_bp)  # Add this registration
    
    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)