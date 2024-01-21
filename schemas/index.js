import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connect = () => {
  const mongoUri = process.env.MONGO_URI;
  const dbName = process.env.MONGO_DB_NAME;

  mongoose
    .connect(mongoUri, { dbName })
    .then(() => console.log("MongoDB 연결에 성공하였습니다."))
    .catch((err) => console.log(`MongoDB 연결에 실패하였습니다. ${err}`));
};

mongoose.connection.on("error", (err) => {
  console.error("MongoDB 연결 에러", err);
});

export default connect;