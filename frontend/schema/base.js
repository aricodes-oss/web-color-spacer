import { serialize, deserialize } from 'serializr';

class Resource {
  // in static methods `this` refers to the constructor
  static from(obj) {
    return deserialize(this, obj);
  }

  get serialized() {
    return serialize(this);
  }
}

export default Resource;
