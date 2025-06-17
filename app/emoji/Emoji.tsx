"use client"

import {useState, useEffect} from 'react';
import {Select, Spin, Image, Row, Col} from 'antd';
import {replaceImageUrl} from "@/lib/utils";

export interface EmojiCategory {
    id: string;
    text: string;
    url: string;
    label: any;
}

export interface Emoji {
    id: string;
    text: string;
    url: string;
    meta: any;
}

export default function Emoji() {
    const [categories, setCategories] = useState<EmojiCategory[]>([{
        id: "",
        text: "加载中...",
        url: "",
        label: "加载中..."
    }]);
    const [emoji, setEmoji] = useState<Emoji[]>([]);

    const fetchEmoji = async (id: string) => {
        let emoji = await fetch(`/api/common/bilibili/emojiDetail?id=${id}`).then(res => res.json());
        emoji = emoji.data.packages[0].emote;
        console.log(emoji)
        setEmoji(emoji)
    }

    useEffect(() => {
        // 页面加载时获取初始数据
        const fetchData = async () => {
            try {
                const res = await fetch('/api/common/bilibili/allEmoji');
                let data = await res.json();
                data = data.data.all_packages
                data = data.map(i => {
                    return {
                        label: <div className="flex items-center space-x-2">
                            <Image
                                src={replaceImageUrl(i.url)}
                                alt="Emoji Image"
                                width={44}
                                height={44}
                                className="rounded"
                            />
                            <span>{i.text}</span>
                        </div>,
                        value: i.id,
                        text: i.text,
                    }
                })
                setCategories(data);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };
        fetchData();

        fetchEmoji("277");
    }, []);

    return (
        <div className="p-8 max-w-4xl mx-auto w-full">
            <h1 className="text-3xl font-bold mb-6 text-center">b站表情包大全</h1>
            <h1 className="text-xl font-bold mb-6 text-center">点击图片前往原链接（清晰度一样）</h1>

            <div className="flex gap-4 mb-8">
                <Select
                    showSearch
                    labelInValue
                    placeholder="搜索表情，加载全部数据会比较慢"
                    virtual={true}
                    className={"w-full h-14"}
                    options={categories}
                    filterOption={(input, option) =>
                        (option?.text ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    onChange={item => {
                        fetchEmoji(item.value)
                    }}
                >
                </Select>
            </div>

            {/* 图片展示区域 */}
            {emoji.length === 0 ? (
                <div className="flex justify-center py-8">
                    <Spin size="large"/>
                </div>
            ) : (
                <Row gutter={[16, 16]} className="overflow-x-auto pb-4">
                    {emoji.map(emoji => (
                        <Col key={emoji.id} xs={12} md={6}>
                            <div
                                className="bg-gray-50 p-2 rounded-lg shadow-sm cursor-pointer transition hover:shadow-md"
                                onClick={() => {
                                    window.open(emoji.url, '_blank', 'noreferrer');
                                }}
                            >
                                <Image
                                    src={replaceImageUrl(emoji.url)}
                                    alt={emoji.text}
                                    className="w-full h-auto object-contain aspect-square"
                                    preview={false}
                                />
                                <p className="text-black text-center text-sm mt-1 truncate">{emoji.meta.alias}</p>
                            </div>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
}
