#!/env/bin/python3
# -*- coding: utf-8 -*-

# Created by cliff at 7/18/23 11:30 PM

from flask_jwt_extended import jwt_required
from flask import jsonify, request
from datetime import datetime
class Source:

    def __init__(self, app, db):
        self.db  = db
        self.app = app
        class SourceModel(db.Model):
            '''веб адрес
            частота обновления
            автор
            название
            дата создания
            уровень доступа


            Уровень доступа задается по маске:

            ХХХ
            \\\
            \\Удаление
            \Редактирование
            Чтение

            '''
            __tablename__ = "sources"
            id = db.Column(db.Integer, primary_key=True, autoincrement=True)
            name = db.Column(db.String(256), nullable=False, index=True)
            url = db.Column(db.String(256), nullable=False)
            update_sched = db.Column(db.String(16), nullable=False)
            acl = db.Column(db.Integer, nullable=False)
            created = db.Column(db.DateTime)
            last_run = db.Column(db.DateTime)

        self.model = SourceModel


        @app.get("/api/source")
        @jwt_required()
        def getSourceList():
            page_no  = request.args.get("page", 1)
            limit    = request.args.get("limit", 20)
            search   = request.args.get("q", '')
            order    = request.args.get("order", 'DESC')
            sort     = request.args.get("sort", 'id')

            source_data = SourceModel.query.paginate(page=page_no, per_page=limit)

            result = []

            for item in source_data.items:
                result_item = {
                    "id": item.id,
                    "name": item.name,
                    "url": item.url,
                    "cron": item.update_sched,
                    "created": item.created,
                    "last_run": item.last_run
                }
                result.append(result_item)

            return jsonify({"count": len(result), "data": result}), 200


        @app.get("/api/source/<id>")
        @jwt_required()
        def getSource(id):
            item = SourceModel.query.filter_by(id=id).first()
            if item:
                result = {
                        "id": item.id,
                        "name": item.name,
                        "url": item.url,
                        "cron": item.update_sched,
                        "created": item.created,
                        "last_run": item.last_run
                    }
                return jsonify(result), 200
            else:
                return jsonify({"msg": "Item with id={} not found".format(id)})


        @app.post("/api/source")
        @jwt_required()
        def createSource():

            try:
                name = request.json["name"]
            except KeyError:
                return jsonify({"msg": "Source name is required"}), 400

            try:
                url = request.json["url"]
            except KeyError:
                return jsonify({"msg": "Source URL is required"}), 400

            try:
                cron = request.json["cron"]
            except KeyError:
                return jsonify({"msg": "Source cron is required"}), 400

            if not self.verifyCron(cron):
                return jsonify({"msg": "Error in cron format"}), 400

            item = SourceModel(name=name,
                               url=url,
                               update_sched=cron,
                               acl=111,
                               created=datetime.now(),
                               last_run=datetime.fromtimestamp(0))
            db.session.add(item)
            db.session.commit()
            db.session.refresh(item)
            return jsonify({"id": item.id}), 200


        @app.patch("/api/source/<id>")
        @jwt_required()
        def updateSource(id):
            item = SourceModel.query.filter_by(id=id).first()
            name = request.json["name"]
            url  = request.json["url"]
            cron = request.json["cron"]

            print(name, url, cron)

            if item:
                if name: item.name = name
                if url:  item.url  = url
                if cron: item.cron = cron
                db.session.commit()
                return jsonify({"id": id}), 200
            else:
                return jsonify({"msg": "Item with id={} not found".format(id)})


        @app.delete("/api/source/<id>")
        @jwt_required()
        def deleteSource(id):
            item = SourceModel.query.filter_by(id=id).first()
            if item:
                db.session.delete(item)
                db.session.commit()
                return jsonify({"id": id}), 200
            else:
                return jsonify({"msg": "Item with id={} not found".format(id)})


    @staticmethod
    def verifyCron(cron):
        #TODO
        return True


    def createSampleSource(self):
        source = self.model(id=1,
                             name="example",
                             url="https://www.example.com",
                             update_sched="* * * * *",
                             acl=111,
                             created=datetime.now(),
                             last_run=datetime.fromtimestamp(0)
                            )
        self.db.session.add(source)