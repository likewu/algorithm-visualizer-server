//import { LspTracer } from 'tracers/LspTracer';
import { RunTracer as LspTracer } from 'tracers/RunTracer';

import { Release } from 'tracers/Tracer';
import { GitHubApi } from 'utils/apis';

export class JuliaTracer extends LspTracer {
  constructor() {
    super('julia');
  }

  async update(release?: Release) {
    if (release) {
      return this.build(release);
    }
    const {data} = await GitHubApi.getLatestRelease('likewu', `tracers.${this.lang}`);
    return this.build(data);
  }
}
