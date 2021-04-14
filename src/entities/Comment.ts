import {
  Entity as TOEntity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from "typeorm";
import { makeId } from "../util/helpers";

import Entity from "./Entity";
import Tip from "./Tip";
import User from "./User";

@TOEntity("comments")
export default class Comment extends Entity {
  constructor(comment: Partial<Comment>) {
    super();
    Object.assign(this, comment);
  }

  @Index()
  @Column()
  identifier: string;

  @Column()
  body: string;

  @Column()
  username: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @ManyToOne(() => Tip, (tip) => tip.comments, { nullable: false })
  tip: Tip;

  @BeforeInsert()
  makeIdEndSlug() {
    this.identifier = makeId(8);
  }
}
