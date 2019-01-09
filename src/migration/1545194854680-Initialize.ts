import {MigrationInterface, QueryRunner} from "typeorm";

export class Initialize1545194854680 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "drama" ("id" SERIAL NOT NULL, "channel" character varying NOT NULL, "authorUsername" character varying NOT NULL, "authorId" character varying NOT NULL, "reason" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_8b981431953bc6636df3d7d6174" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "quote" ("id" SERIAL NOT NULL, "channel" character varying NOT NULL, "quoteeUsername" character varying NOT NULL, "quoteeId" character varying NOT NULL, "authorUsername" character varying NOT NULL, "authorId" character varying NOT NULL, "content" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_b772d4cb09e587c8c72a78d2439" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "think" ("id" SERIAL NOT NULL, "channel" character varying NOT NULL, "authorUsername" character varying NOT NULL, "authorId" character varying NOT NULL, "url" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_a5a185d9161091a285e6954ac64" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "think"`);
        await queryRunner.query(`DROP TABLE "quote"`);
        await queryRunner.query(`DROP TABLE "drama"`);
    }

}
