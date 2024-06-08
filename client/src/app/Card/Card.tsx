"use client";
import { useState } from "react";
import "./card.css";
import custom from "./custom.module.scss";
import clsx from "clsx";

export interface CardProps {}

export default function Card(props: CardProps) {
  const [expading, setExpading] = useState(false);
  return (
    <div
      className={clsx("card", {
        [custom.card]: expading,
      })}
    >
      Card
    </div>
  );
}
