from flask import Flask, request, render_template
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from dataclasses import dataclass
from flask_cors import CORS, cross_origin
# from flask.ext.cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:winnerofall@localhost/project_fsd'
db = SQLAlchemy(app)
CORS(app)

# defining a class Event with passing db model


@dataclass
class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False,
                           default=datetime.utcnow)

    def __repr__(self):
        return f"Event:{self.description}"

    def __init__(self, description):
        self.description = description


def format_event(event):
    return {
        "description": event.description,
        "id": event.id,
        "created_at": event.created_at
    }


@app.route('/')
def hello():
    return render_template('index.html')

# create an event


@app.route('/events', methods=['POST'])
def create_event():
    # reading description from the json object
    description = request.json['description']
    # creating a variable event
    event = Event(description)
    db.session.add(event)  # add that Event to the session
    db.session.commit()
    return format_event(event)


# Get all events
@app.route('/events', methods=['GET'])
def get_events():
    events = Event.query.order_by(Event.id.asc()).all()
    # events = Event.query.all()
    event_list = []
    for event in events:
        event_list.append(format_event(event))
    return {'events': event_list}

# get a single event


@app.route('/events/<id>', methods=['GET'])
def get_event(id):
    event = Event.query.filter_by(id=id).one()
    formatted_event = format_event(event)
    return {'event': formatted_event}

# delete an event


@app.route('/events/<id>', methods=['DELETE'])
def delete_event(id):
    event = Event.query.filter_by(id=id).one()
    db.session.delete(event)
    db.session.commit()
    return f'Event (id:{id}) has been deleted.'

# edit event


@app.route('/events/<id>/', methods=['PUT'])
def update_event(id):
    event = Event.query.filter_by(id=id)
    description = request.json['description']
    event.update(dict(description=description, created_at=datetime.utcnow()))
    db.session.commit()
    return {'event': format_event(event.one())}


if __name__ == '__main__':
    app.run()

# db.create_all()
