"use strict";

const File = use("App/Models/File");
const Helpers = use("Helpers");

class FileController {
  async store({ request, response }) {
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

  async show({ params, request, response, view }) {
    const { id } = params;
    try {
      const file = await File.findOrFail(id);

      return response.download(Helpers.tmpPath(`uploads/${file.file}`));
    } catch (error) {
      console.log(error);
      return response.status(404).send({
        error: { message: "Erro ao encontrar o arquivo." },
      });
    }
  }

  async update({ params, request, response }) {
    const { id } = params;
    try {
      if (!request.file("file")) return;

      const fileBD = await File.findOrFail(id);

      const upload = request.file("file", { size: "2mb" });

      const filename = `${Date.now()}.${upload.subtype}`;

      const fs = Helpers.promisify(require("fs"));
      await fs.unlink(Helpers.tmpPath(`uploads/${fileBD.file}`));

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

      fileBD.merge(file);
      fileBD.save();
      return fileBD;
    } catch (error) {
      console.log(error);
      return response.status(404).send({
        error: { message: "Erro no upload do arquivo." },
      });
    }
  }

  async destroy({ params, request, response }) {
    const { id } = params;
    try {
      const file = await File.findOrFail(id);
      const fs = Helpers.promisify(require("fs"));
      await fs.unlink(Helpers.tmpPath(`uploads/${file.file}`));
      file.delete();
      return id;
    } catch (error) {
      console.log(error);
      return response.status(404).send({
        error: { message: "Erro ao encontrar o arquivo." },
      });
    }
  }
}

module.exports = FileController;
