import {
  Entity as TOEntity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  OneToMany,
} from "typeorm";
import { makeId, slugify } from "../util/helpers";

import Entity from "./Entity";
import Sub from "./Sub";
import User from "./User";
import Comment from "./Comment";

@TOEntity("tips")
export default class Tip extends Entity {
  constructor(tip: Partial<Tip>) {
    super();
    Object.assign(this, tip);
  }

  @Index()
  @Column()
  identifier: string; // 7character id

  @Column()
  title: string;

  @Index()
  @Column()
  slug: string;

  @Column({ nullable: true, type: "text" })
  body: string;

  @Column()
  subName: string;

  @ManyToOne(() => User, (user) => user.tips)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @ManyToOne(() => Sub, (sub) => sub.tips)
  @JoinColumn({ name: "subName", referencedColumnName: "name" })
  sub: Sub;

  @OneToMany(() => Comment, (comment) => comment.tip)
  comments: Comment[];

  @BeforeInsert()
  makeIdEndSlug() {
    this.identifier = makeId(7);
    this.slug = slugify(this.title);
  }
}
