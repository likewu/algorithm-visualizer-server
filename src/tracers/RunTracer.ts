import path from 'path';
import { Release, Tracer } from 'tracers/Tracer';
import express from 'express';
import uuid from 'uuid';
import fs from 'fs-extra';
import { memoryLimit, timeLimit } from 'config/constants';
import { codesDir } from 'config/paths';
import { execute } from 'utils/misc';

export class RunTracer extends Tracer {
  private readonly directory: string;

  constructor(lang: string) {
    super(lang);
    this.directory = path.resolve(__dirname, lang);
  }

  async build(release: Release) {
    const {tag_name} = release;
  }

  route(router: express.Router) {
    router.post(`/${this.lang}`, (req, res, next) => {
      const {code} = req.body;
      const tempPath = path.resolve(codesDir, uuid.v4());
      fs.outputFile(path.resolve(tempPath, `Main.${this.lang}`), code)
        .then(() => {
          return execute([
            'julia',
            `${tempPath}`,
          ].join(' ')).then((data) => {
            //const payload = JSON.parse(data.Payload);
            //if (!payload.success) return next(new BadRequest(payload.errorMessage));
            //res.send(payload.commands);
            res.send(data);
          }).catch(error => {
            throw error;
          }).finally(() => {});
        })
        .catch(next)
        .finally(() => fs.remove(tempPath));
    });
  }
}
