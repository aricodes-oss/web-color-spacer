import ky from 'ky-universal';
import { deserialize } from 'serializr';
import urlJoin from 'url-join';

class APIResource {
  baseUrl = '/v1';
  resource = '';
  model = null;
  ky;

  constructor(resource, baseUrl = '/v1') {
    this.baseUrl ||= baseUrl;
    this.resource ||= resource;

    this.ky = ky.extend({ parseJson: this.parseJson });
  }

  parseJson = text => {
    const parsed = JSON.parse(text);
    return Array.isArray(parsed)
      ? parsed.map(i => deserialize(this.model, i))
      : deserialize(this.model, parsed);
  };

  get path() {
    return urlJoin(this.baseUrl, this.resource);
  }

  get queryKey() {
    return [this.resource];
  }

  // Using arrow functions so that `this` is always bound to the  `APIResource` instance
  all = async () => await this.ky.get(this.path).json();
  create = async obj => await this.ky.post(this.path, { json: obj }).json();
  fetch = async id => await this.ky.get(urlJoin(this.path, id)).json();
  update = async (id, obj) => await this.ky.patch(urlJoin(this.path, id), { json: obj }).json();
  delete = async id => await this.ky.delete(urlJoin(this.path, id)).json();
}

export default APIResource;
