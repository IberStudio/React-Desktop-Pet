from flask import Blueprint, request, jsonify
from models.schedule import Schedule, search_data, delete_data
from extensions import db
from datetime import datetime

schedules_bp = Blueprint(
    "schedules",
    __name__,
    url_prefix="/api/schedules"
)

@schedules_bp.post("/")
def create_schedule():
    data = request.get_json()
    try:
        d = datetime.strptime(data["date"], "%Y-%m-%d").date()
        h = datetime.strptime(data["hour"], "%H:%M").time()
        title = data["title"]
    except (KeyError, ValueError):
        return jsonify({"error": "Expected date (YYYY-MM-DD), hour (HH:MM), schedule (str)"}), 400

    entry = Schedule(date=d, hour=h, title=title, color=data["color"])
    db.session.add(entry)
    db.session.commit()
    return jsonify(entry.to_dict()), 201

@schedules_bp.get("/")
def get_schedules():
    date = request.args.get("date")

    if not date:
        schedules = Schedule.query.all()
        return jsonify([s.to_dict() for s in schedules]), 200

    schedule = search_data(date)

    if schedule is None:
        return jsonify({"error": "invalid date format, expected YYYY-MM-DD"}), 400

    return jsonify(schedule), 200

@schedules_bp.delete("/")
def delete_schedule():
    date = request.args.get("date")

    if not date:
        return jsonify({"error": "date query parameter is required"}), 400

    deleted = delete_data(date)

    if deleted is None:
        return jsonify({"error": "invalid date format, expected YYYY-MM-DD"}), 400

    return jsonify({"deleted": deleted}), 200