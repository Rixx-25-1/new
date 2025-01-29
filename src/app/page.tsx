import Image from "next/image";
import styles from "./page.module.css";
import { LoginPage } from "@/components/login/LoginPage";

export default function Home() {
  return (
   <div>
    {/* <h1>Main page</h1> */}
    <LoginPage></LoginPage>
 
   </div> 
     );
}
