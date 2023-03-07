import {
  Text,
  RichText,
  Field,
  withDatasourceCheck,
  GetStaticComponentProps,
  GetServerSideComponentProps,
  useComponentProps,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';

type ContentBlockProps = ComponentProps & {
  fields: {
    heading: Field<string>;
    content: Field<string>;
  };
};

/**
 * A simple Content Block component, with a heading and rich text block.
 * This is the most basic building block of a content site, and the most basic
 * JSS component that's useful.
 */
const ContentBlock = ({ fields, rendering }: ContentBlockProps): JSX.Element => {
  const thirdPartyData = rendering.uid ? useComponentProps<string>(rendering.uid) : undefined;
  return (
    <div className="contentBlock">
      <Text tag="h2" className="contentTitle" field={fields.heading} />

      <RichText className="contentDescription" field={fields.content} />
      <div>
        <h4>Raw JSON of all the beers:</h4>
        <pre>{JSON.stringify(thirdPartyData, null, 2)}</pre>
      </div>
    </div>
  );
};

//our custom method to fetch the data from third-party
export const fetchBeerData = (searchWord: string): Promise<string> =>
  fetch('https://api.sampleapis.com/beers/' + searchWord).then((response) => response.json());

//getStaticProps method will be used when component is located on the page that uses SSG
export const getStaticProps: GetStaticComponentProps = async (rendering) => {
  //following line can be used to pass parameters to the third-party call, for example from field values
  const someDataFromRenderingFields = rendering?.fields?.heading;
  const customData = await fetchBeerData('ale');

  return customData;
};

//getServerSideProps method will be used when component is located on the page that uses SSR
export const getServerSideProps: GetServerSideComponentProps = async (rendering, layoutData) => {
  //following line can be used to pass parameters to the third-party call, for example from field values
  const someDataFromRenderingFields = rendering?.fields?.heading;
  const customData = await fetchBeerData('ale');

  return customData;
};

export default withDatasourceCheck()<ContentBlockProps>(ContentBlock);
