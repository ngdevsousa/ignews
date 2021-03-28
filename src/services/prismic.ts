import Prismic from "@prismicio/client";

export function getPrismicClient(req?: unknown) {
  const prismic = Prismic.client(process.env.PRISMIC_URL, {
    accessToken: process.env.PRISMIC_SECRET,
    req: req
  });

  return prismic;
}