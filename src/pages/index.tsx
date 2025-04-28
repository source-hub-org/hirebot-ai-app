import { GetServerSideProps } from 'next';

// This function gets called at request time
export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/admin/candidates',
      permanent: false,
    },
  };
};

// This component will never be rendered on the client because of the redirect
export default function Home() {
  return null;
}