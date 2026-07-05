from flask import Blueprint, request, jsonify
from extensions import db
from models.task import Task

tasks_bp = Blueprint(
    "tasks",
    __name__,
    url_prefix="/api/tasks"
)

@tasks_bp.get("/")
def get_tasks():
    tasks = Task.query.all()
    return jsonify([task.to_dict() for task in tasks])


@tasks_bp.post("/")
def create_task():
    data = request.get_json()

    if not data["title"]:
        return {"error": "Title is required"}, 400

    task = Task(title=data["title"])

    db.session.add(task)
    db.session.commit()

    return jsonify(task.to_dict()), 201


@tasks_bp.put("/<int:id>")
def update_task(id):
    data = request.get_json()

    task = Task.query.get(id)
    if not task:
        return {"error": "Task not found"}, 404

    task.completed = data["completed"]
    db.session.commit()

    return task.to_dict()


@tasks_bp.delete("/<int:id>")
def delete_task(id):
    task = Task.query.get_or_404(id)

    db.session.delete(task)
    db.session.commit()

    return jsonify({"message": "Task deleted"})