from flask import request, jsonify
from models import db
from models.payroll_model import Payroll
from datetime import datetime


def create_payroll():

    try:
        data = request.get_json()

        employee_id = data.get("employee_id")
        payroll_month = data.get("payroll_month")

        basic_salary = data.get("basic_salary", 0)
        hra = data.get("hra", 0)
        da = data.get("da", 0)
        bonus = data.get("bonus", 0)
        overtime = data.get("overtime", 0)
        pf = data.get("pf", 0)
        tax = data.get("tax", 0)

        gross_salary = (
            float(basic_salary)
            + float(hra)
            + float(da)
            + float(bonus)
            + float(overtime)
        )

        net_salary = gross_salary - float(pf) - float(tax)

        payroll = Payroll(
            employee_id=employee_id,
            payroll_month=datetime.strptime(
                payroll_month,
                "%Y-%m-%d"
            ).date(),
            basic_salary=basic_salary,
            hra=hra,
            da=da,
            bonus=bonus,
            overtime=overtime,
            pf=pf,
            tax=tax,
            gross_salary=gross_salary,
            net_salary=net_salary
        )

        db.session.add(payroll)
        db.session.commit()

        return jsonify({
            "message": "Payroll created successfully",
            "payroll": payroll.to_dict()
        }), 201

    except Exception as e:

        db.session.rollback()

        print("PAYROLL ERROR:", str(e))

        return jsonify({
            "error": str(e)
        }), 500


def get_payrolls():

    payrolls = Payroll.query.all()

    return jsonify([
        payroll.to_dict()
        for payroll in payrolls
    ]), 200


def get_payroll_by_employee(employee_id):

    payrolls = Payroll.query.filter_by(
        employee_id=employee_id
    ).all()

    return jsonify([
        payroll.to_dict()
        for payroll in payrolls
    ]), 200