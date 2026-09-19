import os
import json
import sqlite3
import datetime
from typing import List, Dict, Any

class DatabaseManager:
    """
    Dual Storage Manager:
    Attempts connection to MongoDB at mongodb://localhost:27017.
    If MongoDB is unavailable, automatically falls back to local SQLite database.
    """
    def __init__(self, db_name="adaptive_manufacturing", mongo_uri="mongodb://localhost:27017/"):
        self.db_name = db_name
        self.use_mongo = False
        self.mongo_client = None
        self.db = None
        self.sqlite_path = os.path.join(os.path.dirname(__file__), "adaptive_manufacturing.db")

        # Try MongoDB initial connection
        try:
            from pymongo import MongoClient
            self.mongo_client = MongoClient(mongo_uri, serverSelectionTimeoutMS=1000)
            # Trigger server info request to verify connection
            self.mongo_client.server_info()
            self.db = self.mongo_client[self.db_name]
            self.use_mongo = True
            print("[DatabaseManager] Successfully connected to MongoDB.")
        except Exception as e:
            print(f"[DatabaseManager] MongoDB not available ({e}). Using local SQLite fallback: {self.sqlite_path}")
            self._init_sqlite()

    def _init_sqlite(self):
        """Initialize SQLite database tables if fallback is active."""
        conn = sqlite3.connect(self.sqlite_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS telemetry (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                temperature REAL,
                vibration REAL,
                rpm INTEGER,
                load REAL,
                machine_status TEXT,
                condition TEXT,
                timestamp TEXT,
                raw_json TEXT
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS timeline_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT,
                event_type TEXT,
                message TEXT,
                severity TEXT,
                details TEXT
            )
        ''')

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS predictions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT,
                operation_type TEXT,
                material TEXT,
                duration REAL,
                rpm INTEGER,
                expected_load REAL,
                ambient_temp REAL,
                predicted_condition TEXT,
                risk_probability REAL,
                details TEXT
            )
        ''')
        
        conn.commit()
        conn.close()

    def insert_telemetry(self, data: Dict[str, Any]):
        """Store telemetry reading."""
        ts = data.get("timestamp", datetime.datetime.now().strftime("%H:%M:%S"))
        if self.use_mongo:
            try:
                record = dict(data)
                record["created_at"] = datetime.datetime.utcnow()
                self.db.telemetry.insert_one(record)
                return
            except Exception as e:
                print(f"[DatabaseManager] Mongo write failed, writing SQLite: {e}")

        # SQLite fallback
        try:
            conn = sqlite3.connect(self.sqlite_path)
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO telemetry (temperature, vibration, rpm, load, machine_status, condition, timestamp, raw_json)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                data.get("temperature", 0.0),
                data.get("vibration", 0.0),
                data.get("rpm", 0),
                data.get("load", 0.0),
                data.get("machineStatus", "RUNNING"),
                data.get("condition", "NORMAL"),
                ts,
                json.dumps(data)
            ))
            conn.commit()
            conn.close()
        except Exception as e:
            print(f"[DatabaseManager] SQLite insert error: {e}")

    def get_telemetry_history(self, limit: int = 50) -> List[Dict[str, Any]]:
        """Retrieve recent telemetry records."""
        if self.use_mongo:
            try:
                records = list(self.db.telemetry.find({}, {"_id": 0}).sort("_id", -1).limit(limit))
                return list(reversed(records))
            except Exception as e:
                print(f"[DatabaseManager] Mongo fetch failed: {e}")

        # SQLite fallback
        try:
            conn = sqlite3.connect(self.sqlite_path)
            cursor = conn.cursor()
            cursor.execute('SELECT raw_json FROM telemetry ORDER BY id DESC LIMIT ?', (limit,))
            rows = cursor.fetchall()
            conn.close()
            records = [json.loads(row[0]) for row in reversed(rows)]
            return records
        except Exception as e:
            print(f"[DatabaseManager] SQLite fetch error: {e}")
            return []

    def insert_timeline_event(self, event: Dict[str, Any]):
        """Log an event to incident timeline."""
        ts = event.get("timestamp", datetime.datetime.now().strftime("%H:%M:%S"))
        if self.use_mongo:
            try:
                record = dict(event)
                record["created_at"] = datetime.datetime.utcnow()
                self.db.timeline.insert_one(record)
                return
            except Exception as e:
                print(f"[DatabaseManager] Mongo event insert error: {e}")

        try:
            conn = sqlite3.connect(self.sqlite_path)
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO timeline_events (timestamp, event_type, message, severity, details)
                VALUES (?, ?, ?, ?, ?)
            ''', (
                ts,
                event.get("event_type", "INFO"),
                event.get("message", ""),
                event.get("severity", "INFO"),
                json.dumps(event.get("details", {}))
            ))
            conn.commit()
            conn.close()
        except Exception as e:
            print(f"[DatabaseManager] SQLite event error: {e}")

    def get_timeline_events(self, limit: int = 50) -> List[Dict[str, Any]]:
        """Retrieve incident timeline events."""
        if self.use_mongo:
            try:
                events = list(self.db.timeline.find({}, {"_id": 0}).sort("_id", -1).limit(limit))
                return events
            except Exception as e:
                print(f"[DatabaseManager] Mongo timeline fetch error: {e}")

        try:
            conn = sqlite3.connect(self.sqlite_path)
            cursor = conn.cursor()
            cursor.execute('''
                SELECT timestamp, event_type, message, severity, details 
                FROM timeline_events ORDER BY id DESC LIMIT ?
            ''', (limit,))
            rows = cursor.fetchall()
            conn.close()
            events = []
            for r in rows:
                events.append({
                    "timestamp": r[0],
                    "event_type": r[1],
                    "message": r[2],
                    "severity": r[3],
                    "details": json.loads(r[4]) if r[4] else {}
                })
            return events
        except Exception as e:
            print(f"[DatabaseManager] SQLite timeline fetch error: {e}")
            return []

    def insert_prediction(self, pred: Dict[str, Any]):
        """Store AI prediction record."""
        ts = pred.get("timestamp", datetime.datetime.now().strftime("%H:%M:%S"))
        if self.use_mongo:
            try:
                record = dict(pred)
                record["created_at"] = datetime.datetime.utcnow()
                self.db.predictions.insert_one(record)
                return
            except Exception as e:
                print(f"[DatabaseManager] Mongo prediction insert error: {e}")

        try:
            conn = sqlite3.connect(self.sqlite_path)
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO predictions (timestamp, operation_type, material, duration, rpm, expected_load, ambient_temp, predicted_condition, risk_probability, details)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                ts,
                pred.get("operation_type", ""),
                pred.get("material", ""),
                pred.get("duration", 0.0),
                pred.get("rpm", 0),
                pred.get("expected_load", 0.0),
                pred.get("ambient_temp", 0.0),
                pred.get("predicted_condition", "NORMAL"),
                pred.get("risk_probability", 0.0),
                json.dumps(pred)
            ))
            conn.commit()
            conn.close()
        except Exception as e:
            print(f"[DatabaseManager] SQLite prediction insert error: {e}")
