from flask import Flask, render_template, request, redirect
import sqlite3

app = Flask(__name__)

DATABASE = "cade_meu.db"


def conectar():
    banco = sqlite3.connect(DATABASE)
    banco.row_factory = sqlite3.Row
    return banco


def criar_banco():
    banco = conectar()

    banco.execute("""
        CREATE TABLE IF NOT EXISTS objetos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            descricao TEXT NOT NULL,
            local TEXT NOT NULL,
            data TEXT NOT NULL,
            aluno TEXT NOT NULL,
            contato TEXT NOT NULL,
            status TEXT NOT NULL
        )
    """)

    banco.commit()
    banco.close()


@app.route("/")
def inicio():

    banco = conectar()

    objetos = banco.execute(
        "SELECT * FROM objetos ORDER BY id DESC"
    ).fetchall()

    banco.close()

    return render_template(
        "index.html",
        objetos=objetos
    )


@app.route("/cadastrar", methods=["POST"])
def cadastrar():

    nome = request.form["nome"]
    descricao = request.form["descricao"]
    local = request.form["local"]
    data = request.form["data"]
    aluno = request.form["aluno"]
    contato = request.form["contato"]
    status = request.form["status"]

    banco = conectar()

    banco.execute("""
        INSERT INTO objetos
        (nome, descricao, local, data, aluno, contato, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        nome,
        descricao,
        local,
        data,
        aluno,
        contato,
        status
    ))

    banco.commit()
    banco.close()

    return redirect("/")


@app.route("/alterar/<int:id>", methods=["POST"])
def alterar(id):

    banco = conectar()

    objeto = banco.execute(
        "SELECT status FROM objetos WHERE id = ?",
        (id,)
    ).fetchone()

    if objeto:

        if objeto["status"] == "Perdido":
            novo_status = "Encontrado"
        else:
            novo_status = "Perdido"

        banco.execute(
            "UPDATE objetos SET status = ? WHERE id = ?",
            (novo_status, id)
        )

        banco.commit()

    banco.close()

    return redirect("/")


@app.route("/excluir/<int:id>", methods=["POST"])
def excluir(id):

    banco = conectar()

    banco.execute(
        "DELETE FROM objetos WHERE id = ?",
        (id,)
    )

    banco.commit()
    banco.close()

    return redirect("/")


if __name__ == "__main__":
    criar_banco()
    app.run(debug=True)
