import {MigrationInterface, QueryRunner} from "typeorm";

export class QuoteColumnUpdate1545195947546 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "quote" ALTER COLUMN "quoteeId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "quote" ALTER COLUMN "authorId" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "quote" ALTER COLUMN "authorId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "quote" ALTER COLUMN "quoteeId" SET NOT NULL`);
    }

}
