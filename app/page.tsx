'use client'
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const TopPage = () => {
  const [articles, setArticles] = useState([]);
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [date, setDate] = useState(today.getDate());
  const [dateForApi, setDateForApi] = useState('');

  const api_key = process.env.NEXT_PUBLIC_API_KEY;

  useEffect(() => {
    const formattedMonth = month.toString().padStart(2, '0');
    const formattedDate = date.toString().padStart(2, '0');
    setDateForApi(`${year}-${formattedMonth}-${formattedDate}`);
  }, [year, month, date]);

  const handleGetData = async () => {
    const res = await fetch(
      `https://newsapi.org/v2/everything?q=apple&from=${dateForApi}&to=${dateForApi}&sortBy=popularity&apiKey=${api_key}`
    );
    const data = await res.json();
    console.log(data);
    if (data.articles) {
      setArticles(data.articles);
    }
  };

  useEffect(() => {
    if (dateForApi) {
      handleGetData();
    }
  }, [dateForApi]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value);
    setYear(selectedDate.getFullYear());
    setMonth(selectedDate.getMonth() + 1);
    setDate(selectedDate.getDate());
  };

  const getCurrentDateValue = () => {
    const formattedMonth = month.toString().padStart(2, '0');
    const formattedDate = date.toString().padStart(2, '0');
    return `${year}-${formattedMonth}-${formattedDate}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">News</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-center gap-4">
            <label htmlFor="date-picker" className="text-lg font-semibold">
              日付を選択:
            </label>
            <input
              id="date-picker"
              type="date"
              value={getCurrentDateValue()}
              onChange={handleDateChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => {
                setYear(today.getFullYear());
                setMonth(today.getMonth() + 1);
                setDate(today.getDate());
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              今日
            </button>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-6 text-center">
          {year}年{month}月{date}日のニュース
        </h2>

        <div className="grid gap-6">
          {articles.map((article, index) => {
            return (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                {article.urlToImage && (
                  <div className="relative w-full h-64">
                    <Image
                      src={article.urlToImage}
                      alt={article.title}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                  <p className="text-gray-600 mb-2">{article.description}</p>
                  <p className="text-gray-500 mb-4">{article.content}</p>
                  <hr className="mt-4 mb-4"/>
                  <div className="text-sm text-gray-400 mb-4">
                    <p>author: {article.author}</p>
                    <p>{article.publishedAt}</p>
                  </div>
                  <Link
                    href={article.url}
                    target="_blank"
                    className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  >
                    記事を読む
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TopPage;