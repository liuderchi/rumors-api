import gql from 'util/GraphQL';
// import { loadFixtures, unloadFixtures } from 'util/fixtures';
import client from 'util/client';
// import fixtures from '../__fixtures__/SetArticle';

import MockDate from 'mockdate';

describe('SetArticle', () => {
  // beforeAll(() => loadFixtures(fixtures));

  it('creates articles', async () => {
    MockDate.set(1485593157011);
    const { data, errors } = await gql`
      mutation(
        $text: String!
        $references: [ArticleReferenceInput!]
      ) {
        SetArticle(
          text: $text
          references: $references
        ) {
          id
        }
      }
    `({
      text: 'FOO FOO', references: [{ type: 'LINE' }],
    });
    MockDate.reset();

    expect(errors).toBeUndefined();

    const doc = await client.get({ index: 'articles', type: 'basic', id: data.SetArticle.id });
    delete doc._id; // delete auto-generated id from being snapshot

    expect(doc).toMatchSnapshot();

    // Cleanup
    await client.delete({ index: 'articles', type: 'basic', id: data.SetArticle.id });
  });

  it('updates references for existing article, only 1 LINE reference is available, and permalink is filled for URL references');

  it('throws error if both id and text is not given', async () => {
    const { errors } = await gql`
      mutation(
        $references: [ArticleReferenceInput!]
      ) {
        SetArticle(
          references: $references
        ) {
          id
        }
      }
    `({
      references: [{ type: 'LINE' }],
    });
    expect(errors).toMatchSnapshot();
  });

  // afterAll(() => unloadFixtures(fixtures));
});
