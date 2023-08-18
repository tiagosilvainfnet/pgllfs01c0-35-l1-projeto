import bcrypt from 'bcrypt';

const encryptPassword = async (request: any) => {
    if(request.payload.password) {
        request.payload = {
          ...request.payload,
          password: await bcrypt.hash(request.payload.password, 10)
        }
      }
    return request;
};

export { encryptPassword };