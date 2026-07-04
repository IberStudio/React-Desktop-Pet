from extensions import db
from datetime import datetime

class Schedule(db.Model):
    __tablename__ = "schedules"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    date = db.Column(db.Date, nullable=False)
    hour = db.Column(db.Time, nullable=False)
    color = db.Column(db.String(255), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "date": self.date.isoformat() if self.date else None,
            "title": self.title,
            "hour": self.hour.strftime("%H:%M") if self.hour else None,
            "color": self.color
        }

def search_data(date_str: str):
    try:
        date = datetime.strptime(date_str.rstrip("/"), "%Y-%m-%d").date()
    except ValueError:
        return None

    schedules = Schedule.query.filter_by(date=date).all()
    return [schedule.to_dict() for schedule in schedules]

def delete_data(date_str: str):
    try:
        date = datetime.strptime(date_str.rstrip("/"), "%Y-%m-%d").date()
    except ValueError:
        return None

    schedules = Schedule.query.filter_by(date=date).all()
    
    if not schedules:
        return []

    for schedule in schedules:
        db.session.delete(schedule)
    db.session.commit()

    return [schedule.to_dict() for schedule in schedules]