from flask import jsonify


def get_modelo_usuario(
        code="",
        nome="",
        dataNascimento="0000-00-00",
        genero=0,
        email="",
        senha=""
) -> dict:
    modelo_ordem ={
        'id': code,
        'nome': nome,
        'dataNascimento': dataNascimento,
        'genero': genero,
        'email': email,
        'senha': senha
    }
    return modelo_ordem


def get_modelo_json(status="success", message="", data=None, error=None, status_code=200):
    modelo = {
        "status": status,
        "message": message,
        "data": data,
        "errors": error
    }
    return jsonify(modelo), status_code
