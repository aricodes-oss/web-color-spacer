import ky from 'ky-universal';
import urlJoin from 'url-join';

class APIResource {
  baseUrl = '/v1';
  resource = '';
  constructor(resource, baseUrl = '/v1') {
    this.baseUrl = baseUrl;
    this.resource = resource;
  }

  get path() {
    return urlJoin(this.baseUrl, this.resource);
  }

  // Using arrow functions so that `this` is always bound to the  `APIResource` instance
  all = async () => await ky.get(this.path).json();
  create = async obj => await ky.post(this.path, { json: obj }).json();
  fetch = async id => await ky.get(urlJoin(this.path, id)).json();
  update = async (id, obj) => await ky.patch(urlJoin(this.path, id), { json: obj }).json();
  delete = async id => await ky.delete(urlJoin(this.path, id)).json();
}

export default APIResource;
