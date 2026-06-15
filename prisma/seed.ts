import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient, PostStatus } from '../app/generated/prisma/client'
import bcrypt from 'bcryptjs'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is not set')
}

const adapter = new PrismaPg({
  connectionString,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  const passwordHash = await bcrypt.hash('yoseian', 10)

  const admin = await prisma.user.upsert({
    where: {
      email: 'admin@yoseian.com',
    },
    update: {},
    create: {
      email: 'admin@yoseian.com',
      name: 'Admin',
      passwordHash,
    },
  })

  const nuxtCategory = await prisma.category.upsert({
    where: {
      slug: 'nuxt',
    },
    update: {},
    create: {
      name: 'Nuxt',
      slug: 'nuxt',
    },
  })

  const prismaCategory = await prisma.category.upsert({
    where: {
      slug: 'prisma',
    },
    update: {},
    create: {
      name: 'Prisma',
      slug: 'prisma',
    },
  })

  const databaseCategory = await prisma.category.upsert({
    where: {
      slug: 'database',
    },
    update: {},
    create: {
      name: 'Database',
      slug: 'database',
    },
  })

  await prisma.post.upsert({
    where: {
      slug: 'build-cms-with-nuxt-prisma-neon',
    },
    update: {},
    create: {
      title: 'Nuxt 4 と Prisma 7 で軽量 CMS を作る',
      slug: 'build-cms-with-nuxt-prisma-neon',
      excerpt:
        'Nuxt 4、Prisma 7、Neon PostgreSQL を使って、軽量な CMS を構築した記録です。',
      content: `この文章では、CMS ポートフォリオプロジェクトの初期構築についてまとめます。

まず Nuxt 4 でプロジェクトを作成し、UI ライブラリとして Nuxt UI を導入しました。次に Prisma 7 を使ってデータベースモデルを定義し、Neon PostgreSQL に接続しました。

データベースには User、Category、Post の3つのモデルを用意しました。User は管理者ユーザー、Category は記事の分類、Post は CMS で管理する記事データを表します。

その後、Prisma Migrate を実行して、定義したモデルをもとに PostgreSQL 上にテーブルを作成しました。最後に Nuxt Server API から Prisma Client を使ってデータベースにアクセスし、正常に接続できることを確認しました。

この段階で、Nuxt アプリケーション、UI ライブラリ、ORM、クラウドデータベースの基本的な接続が完了しました。`,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(),
      authorId: admin.id,
      categoryId: nuxtCategory.id,
    },
  })

  await prisma.post.upsert({
    where: {
      slug: 'what-is-prisma-adapter',
    },
    update: {},
    create: {
      title: 'Prisma 7 の adapter とは何か',
      slug: 'what-is-prisma-adapter',
      excerpt:
        'Prisma Client、adapter、pg driver、PostgreSQL の関係について整理します。',
      content: `Prisma 7 では、Prisma Client を作成するときに database adapter を指定する必要があります。

今回のプロジェクトでは PostgreSQL を使っているため、@prisma/adapter-pg と pg を導入しました。pg は Node.js から PostgreSQL に接続するためのデータベースドライバーです。一方、@prisma/adapter-pg は Prisma Client と pg の間に入る適配層です。

処理の流れは次のようになります。

Nuxt Server API から Prisma Client を呼び出し、Prisma Client が adapter を通して pg に処理を渡します。そして pg が実際に PostgreSQL と通信し、SQL を実行して結果を返します。

つまり、Prisma Client は上位層に統一された型安全な API を提供し、adapter は具体的な database driver との差を吸収します。この仕組みによって、アプリケーション側のコードはデータベース接続の細かい実装を意識しなくてもよくなります。`,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(),
      authorId: admin.id,
      categoryId: prismaCategory.id,
    },
  })

  await prisma.post.upsert({
    where: {
      slug: 'why-use-neon-postgresql',
    },
    update: {},
    create: {
      title: 'Neon PostgreSQL を選んだ理由',
      slug: 'why-use-neon-postgresql',
      excerpt:
        'Vercel にデプロイする CMS 作品集として、Neon PostgreSQL を選んだ理由をまとめます。',
      content: `この CMS プロジェクトでは、データベースとして Neon PostgreSQL を使用しています。

Neon はクラウド上で利用できる PostgreSQL サービスで、個人開発やポートフォリオ用途でも使いやすい構成になっています。ローカル環境だけでなく、Vercel にデプロイした後のオンライン Demo からも同じデータベースに接続できます。

今回のプロジェクトは、日本でのフロントエンドエンジニア転職活動に向けたポートフォリオとして作成しています。そのため、面接担当者が実際にアクセスできる Demo 環境を用意することが重要です。

Neon を使うことで、PostgreSQL の実践的な利用経験を示しながら、Prisma、Nuxt Server API、Vercel との連携も説明しやすくなります。

今後は、このデータベースを使って記事の作成、編集、削除、公開状態の管理など、CMS として必要な機能を実装していきます。`,
      status: PostStatus.DRAFT,
      authorId: admin.id,
      categoryId: databaseCategory.id,
    },
  })

  console.log('Seed data created successfully.')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })