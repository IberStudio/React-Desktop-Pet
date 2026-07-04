from flask import Flask
from flask_cors import CORS

from config import Config
from extensions import db
from routes.tasks import tasks_bp
from routes.music import stream_bp
from routes.schedule import schedules_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)

    db.init_app(app)

    app.register_blueprint(tasks_bp)
    app.register_blueprint(stream_bp)
    app.register_blueprint(schedules_bp)

    with app.app_context():
        db.create_all()

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=False)