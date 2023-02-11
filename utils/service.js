import bcrypt from 'bcrypt';

const exclude = async(instance, keys) => {
  for (let key of keys) {
    delete instance[key]
  }
  return instance
}

const encrypt_password = async(password) => {
  const salt = bcrypt.genSaltSync(10);
  const result = bcrypt.hashSync(password, salt)
  return result
}

const matched_password = async(raw_password, encrypted_password) => {
  return bcrypt.compareSync(raw_password, encrypted_password)
}

export { exclude, encrypt_password, matched_password};