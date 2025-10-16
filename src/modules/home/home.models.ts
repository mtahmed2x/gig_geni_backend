import { model, Schema } from "mongoose";
import { IHome } from "./home.interface";

const homeSchema = new Schema<IHome>({});

export const Home = model<IHome>("Home", homeSchema);
