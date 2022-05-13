import * as React from 'react';

/**
 * A custom hook to fetch the data from a provided url
 * @param url The url to fetch from
 * @param shouldRefetch boolean flag to indicate if it should refetch in intervals
 * @returns {data, error, loading, fetchData}
 */
 export const useData = (url: string, shouldRefetch: boolean) => {

   const [data, setData] = React.useState(null);
   const [error, setError] = React.useState<Error>();
   const [loading, setLoading] = React.useState(false);


   const fetchData = async (): Promise<void> => {
     try {
       setLoading(true);
       const response = await fetch(url)
         .then(result => {
           if (result.ok) {
            return result.json()
           }

           throw new Error('failed to fetch')
         });

       setData(response);

     } catch (err) {
       console.log({ err });

       if (err instanceof Error) {
         setError(err);
       }
       setError(new Error('generic error'));
     } finally {
       setLoading(false)
     }
   }

   React.useEffect(() => {
     fetchData();

     if (shouldRefetch) {
       const interval = setInterval(() => {
         fetchData()
         error && clearInterval(interval)
       }, 30000);
       return () => clearInterval(interval);
     }
     
   }, [url, shouldRefetch]);

   return { data, error, loading, fetchData }
}
