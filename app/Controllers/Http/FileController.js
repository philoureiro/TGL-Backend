"use strict";

const File = use("App/Models/File");
const Helpers = use("Helpers");

class FileController {
  async store({ request, response, auth }) {
    const { id } = auth._instanceUser["$attributes"];
    //console.log(id);

    try {
      if (!request.file("file")) return;

      const upload = request.file("file", { size: "2mb" });

      const filename = `${Date.now()}.${upload.subtype}`;

      await upload.move(Helpers.tmpPath("uploads"), {
        name: filename,
      });

      if (!upload.moved()) {
        throw upload.error();
      }

      const file = await File.create({
        user_id: id,
        file: filename,
        name: upload.clientName,
        type: upload.type,
        subtype: upload.subtype,
      });

      return file;
    } catch (error) {
      console.log(error);
      return response.status(404).send({
        error: { message: "Erro no upload do arquivo." },
      });
    }
  }

  async index({ response, auth }) {
    try {
      const file = await File.query().where({ user_id: auth.user.id }).first();

      console.log(file);
      return file.file;
    } catch (error) {
      console.log(error);
      return response.status(404).send({
        error: { message: "Erro ao encontrar o arquivo." },
      });
    }
  }

  async show({ response, auth, params }) {
    try {
      const { filename } = params;
      const file = await File.query().where({ file: filename }).first();

      console.log(file);

      return response.download(Helpers.tmpPath(`uploads/${file.file}`));
    } catch (error) {
      console.log(error);
      return response.status(404).send({
        error: { message: "Erro ao encontrar o arquivo." },
      });
    }
  }

  async update({ params, request, response, auth }) {
    const { id } = params;
    try {
      if (!request.file("file")) return;

      const fileBD = await File.query()
        .where({ user_id: auth.user.id, id: id })
        .fetch();

      if (fileBD.rows.length === 0) {
        return response.status(404).send({
          error: { message: "Erro ao encontrar arquivo." },
        });
      } else {
        const upload = request.file("file", { size: "2mb" });
        const filename = `${Date.now()}.${upload.subtype}`;

        const fs = Helpers.promisify(require("fs"));
        await fs.unlink(Helpers.tmpPath(`uploads/${fileBD.rows[0].file}`));

        await upload.move(Helpers.tmpPath("uploads"), {
          name: filename,
        });

        if (!upload.moved()) {
          throw upload.error();
        }

        const file = {
          file: filename,
          name: upload.clientName,
          type: upload.type,
          subtype: upload.subtype,
        };

        fileBD.rows[0].merge(file);
        fileBD.rows[0].save();
        return fileBD;
      }
    } catch (error) {
      console.log(error);
      return response.status(404).send({
        error: { message: "Erro no upload do arquivo." },
      });
    }
  }

  async destroy({ params, response, auth }) {
    const { id } = params;
    const fs = Helpers.promisify(require("fs"));
    try {
      const file = await File.query()
        .where({ user_id: auth.user.id, id: id })
        .fetch();

      if (file.rows.length === 0) {
        response.status(404).send({
          error: { message: "Não encontramos nenhum arquivo com esse id." },
        });
      } else {
        await fs.unlink(Helpers.tmpPath(`uploads/${file.rows[0].file}`));
        file.rows[0].delete();
        return id;
      }
    } catch (error) {
      return response.status(404).send({
        error: { message: "Erro ao encontrar o arquivo." },
      });
    }
  }
}

module.exports = FileController;
