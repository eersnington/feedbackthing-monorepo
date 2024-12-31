// This file was generated by basehub. Do not edit directly. Read more: https://basehub.com/docs/api-reference/basehub-sdk

/* eslint-disable */
/* eslint-disable eslint-comments/no-restricted-disable */
/* tslint:disable */
// @ts-nocheck

export default {
    "scalars": [
        0,
        4,
        5,
        6,
        7,
        25,
        29,
        30,
        32,
        33,
        34,
        35,
        36,
        40,
        49,
        53
    ],
    "types": {
        "AnalyticsKeyScope": {},
        "Authors": {
            "_analyticsKey": [
                53,
                {
                    "scope": [
                        0
                    ]
                }
            ],
            "_id": [
                53
            ],
            "_idPath": [
                53
            ],
            "_meta": [
                42
            ],
            "_searchKey": [
                53
            ],
            "_slug": [
                53
            ],
            "_slugPath": [
                53
            ],
            "_sys": [
                13
            ],
            "_title": [
                53
            ],
            "items": [
                2
            ],
            "__typename": [
                53
            ]
        },
        "AuthorsItem": {
            "_analyticsKey": [
                53,
                {
                    "scope": [
                        0
                    ]
                }
            ],
            "_id": [
                53
            ],
            "_idPath": [
                53
            ],
            "_slug": [
                53
            ],
            "_slugPath": [
                53
            ],
            "_sys": [
                13
            ],
            "_title": [
                53
            ],
            "avatar": [
                15
            ],
            "xUrl": [
                53
            ],
            "__typename": [
                53
            ]
        },
        "AuthorsItemFilterInput": {
            "AND": [
                3
            ],
            "OR": [
                3
            ],
            "_sys_apiNamePath": [
                54
            ],
            "_sys_createdAt": [
                31
            ],
            "_sys_hash": [
                54
            ],
            "_sys_id": [
                54
            ],
            "_sys_idPath": [
                54
            ],
            "_sys_lastModifiedAt": [
                31
            ],
            "_sys_slug": [
                54
            ],
            "_sys_slugPath": [
                54
            ],
            "_sys_title": [
                54
            ],
            "xUrl": [
                54
            ],
            "__typename": [
                53
            ]
        },
        "AuthorsItemOrderByEnum": {},
        "BSHBEventSchema": {},
        "BSHBRichTextContentSchema": {},
        "BSHBRichTextTOCSchema": {},
        "BaseRichTextJson": {
            "blocks": [
                53
            ],
            "content": [
                6
            ],
            "toc": [
                7
            ],
            "__typename": [
                53
            ]
        },
        "BlockAudio": {
            "fileName": [
                53
            ],
            "fileSize": [
                35
            ],
            "lastModified": [
                33
            ],
            "mimeType": [
                53
            ],
            "url": [
                53
            ],
            "__typename": [
                53
            ]
        },
        "BlockCodeSnippet": {
            "allowedLanguages": [
                30
            ],
            "code": [
                53
            ],
            "html": [
                53,
                {
                    "theme": [
                        53
                    ]
                }
            ],
            "language": [
                30
            ],
            "__typename": [
                53
            ]
        },
        "BlockColor": {
            "b": [
                35
            ],
            "g": [
                35
            ],
            "hex": [
                53
            ],
            "hsl": [
                53
            ],
            "r": [
                35
            ],
            "rgb": [
                53
            ],
            "__typename": [
                53
            ]
        },
        "BlockDocument": {
            "_analyticsKey": [
                53,
                {
                    "scope": [
                        0
                    ]
                }
            ],
            "_id": [
                53
            ],
            "_idPath": [
                53
            ],
            "_slug": [
                53
            ],
            "_slugPath": [
                53
            ],
            "_sys": [
                13
            ],
            "_title": [
                53
            ],
            "on_Authors": [
                1
            ],
            "on_AuthorsItem": [
                2
            ],
            "on_Blog": [
                20
            ],
            "on_Categories": [
                26
            ],
            "on_CategoriesItem": [
                27
            ],
            "on_LegalPages": [
                37
            ],
            "on_LegalPagesItem": [
                38
            ],
            "on_Posts": [
                44
            ],
            "on_PostsItem": [
                45
            ],
            "__typename": [
                53
            ]
        },
        "BlockDocumentSys": {
            "apiNamePath": [
                53
            ],
            "createdAt": [
                53
            ],
            "hash": [
                53
            ],
            "id": [
                34
            ],
            "idPath": [
                53
            ],
            "lastModifiedAt": [
                53
            ],
            "slug": [
                53
            ],
            "slugPath": [
                53
            ],
            "title": [
                53
            ],
            "__typename": [
                53
            ]
        },
        "BlockFile": {
            "fileName": [
                53
            ],
            "fileSize": [
                35
            ],
            "lastModified": [
                33
            ],
            "mimeType": [
                53
            ],
            "url": [
                53
            ],
            "__typename": [
                53
            ]
        },
        "BlockImage": {
            "alt": [
                53
            ],
            "aspectRatio": [
                53
            ],
            "blurDataURL": [
                53
            ],
            "fileName": [
                53
            ],
            "fileSize": [
                35
            ],
            "height": [
                35
            ],
            "lastModified": [
                33
            ],
            "mimeType": [
                53
            ],
            "placeholderURL": [
                53
            ],
            "rawUrl": [
                53
            ],
            "thumbhash": [
                53
            ],
            "url": [
                53,
                {
                    "anim": [
                        53
                    ],
                    "background": [
                        53
                    ],
                    "blur": [
                        35
                    ],
                    "border": [
                        53
                    ],
                    "brightness": [
                        35
                    ],
                    "compression": [
                        53
                    ],
                    "contrast": [
                        35
                    ],
                    "dpr": [
                        35
                    ],
                    "fit": [
                        53
                    ],
                    "format": [
                        53
                    ],
                    "gamma": [
                        53
                    ],
                    "gravity": [
                        53
                    ],
                    "height": [
                        35
                    ],
                    "metadata": [
                        53
                    ],
                    "quality": [
                        35
                    ],
                    "rotate": [
                        53
                    ],
                    "sharpen": [
                        53
                    ],
                    "trim": [
                        53
                    ],
                    "width": [
                        35
                    ]
                }
            ],
            "width": [
                35
            ],
            "__typename": [
                53
            ]
        },
        "BlockList": {
            "_analyticsKey": [
                53,
                {
                    "scope": [
                        0
                    ]
                }
            ],
            "_id": [
                53
            ],
            "_idPath": [
                53
            ],
            "_meta": [
                42
            ],
            "_searchKey": [
                53
            ],
            "_slug": [
                53
            ],
            "_slugPath": [
                53
            ],
            "_sys": [
                13
            ],
            "_title": [
                53
            ],
            "on_Authors": [
                1
            ],
            "on_Categories": [
                26
            ],
            "on_LegalPages": [
                37
            ],
            "on_Posts": [
                44
            ],
            "__typename": [
                53
            ]
        },
        "BlockOgImage": {
            "url": [
                53
            ],
            "__typename": [
                53
            ]
        },
        "BlockRichText": {
            "html": [
                53,
                {
                    "slugs": [
                        25
                    ],
                    "toc": [
                        25
                    ]
                }
            ],
            "json": [
                52
            ],
            "markdown": [
                53
            ],
            "plainText": [
                53
            ],
            "readingTime": [
                35,
                {
                    "wpm": [
                        35
                    ]
                }
            ],
            "on_Body": [
                21
            ],
            "on_Body_1": [
                23
            ],
            "__typename": [
                53
            ]
        },
        "BlockVideo": {
            "aspectRatio": [
                53
            ],
            "duration": [
                33
            ],
            "fileName": [
                53
            ],
            "fileSize": [
                35
            ],
            "height": [
                35
            ],
            "lastModified": [
                33
            ],
            "mimeType": [
                53
            ],
            "url": [
                53
            ],
            "width": [
                35
            ],
            "__typename": [
                53
            ]
        },
        "Blog": {
            "_analyticsKey": [
                53,
                {
                    "scope": [
                        0
                    ]
                }
            ],
            "_id": [
                53
            ],
            "_idPath": [
                53
            ],
            "_slug": [
                53
            ],
            "_slugPath": [
                53
            ],
            "_sys": [
                13
            ],
            "_title": [
                53
            ],
            "authors": [
                1,
                {
                    "filter": [
                        3
                    ],
                    "first": [
                        35
                    ],
                    "orderBy": [
                        4
                    ],
                    "skip": [
                        35
                    ]
                }
            ],
            "categories": [
                26,
                {
                    "filter": [
                        28
                    ],
                    "first": [
                        35
                    ],
                    "orderBy": [
                        29
                    ],
                    "skip": [
                        35
                    ]
                }
            ],
            "posts": [
                44,
                {
                    "filter": [
                        46
                    ],
                    "first": [
                        35
                    ],
                    "orderBy": [
                        49
                    ],
                    "skip": [
                        35
                    ]
                }
            ],
            "__typename": [
                53
            ]
        },
        "Body": {
            "html": [
                53,
                {
                    "slugs": [
                        25
                    ],
                    "toc": [
                        25
                    ]
                }
            ],
            "json": [
                22
            ],
            "markdown": [
                53
            ],
            "plainText": [
                53
            ],
            "readingTime": [
                35,
                {
                    "wpm": [
                        35
                    ]
                }
            ],
            "__typename": [
                53
            ]
        },
        "BodyRichText": {
            "content": [
                6
            ],
            "toc": [
                7
            ],
            "__typename": [
                53
            ]
        },
        "Body_1": {
            "html": [
                53,
                {
                    "slugs": [
                        25
                    ],
                    "toc": [
                        25
                    ]
                }
            ],
            "json": [
                24
            ],
            "markdown": [
                53
            ],
            "plainText": [
                53
            ],
            "readingTime": [
                35,
                {
                    "wpm": [
                        35
                    ]
                }
            ],
            "__typename": [
                53
            ]
        },
        "Body_1RichText": {
            "content": [
                6
            ],
            "toc": [
                7
            ],
            "__typename": [
                53
            ]
        },
        "Boolean": {},
        "Categories": {
            "_analyticsKey": [
                53,
                {
                    "scope": [
                        0
                    ]
                }
            ],
            "_id": [
                53
            ],
            "_idPath": [
                53
            ],
            "_meta": [
                42
            ],
            "_searchKey": [
                53
            ],
            "_slug": [
                53
            ],
            "_slugPath": [
                53
            ],
            "_sys": [
                13
            ],
            "_title": [
                53
            ],
            "items": [
                27
            ],
            "__typename": [
                53
            ]
        },
        "CategoriesItem": {
            "_analyticsKey": [
                53,
                {
                    "scope": [
                        0
                    ]
                }
            ],
            "_id": [
                53
            ],
            "_idPath": [
                53
            ],
            "_slug": [
                53
            ],
            "_slugPath": [
                53
            ],
            "_sys": [
                13
            ],
            "_title": [
                53
            ],
            "__typename": [
                53
            ]
        },
        "CategoriesItemFilterInput": {
            "AND": [
                28
            ],
            "OR": [
                28
            ],
            "_sys_apiNamePath": [
                54
            ],
            "_sys_createdAt": [
                31
            ],
            "_sys_hash": [
                54
            ],
            "_sys_id": [
                54
            ],
            "_sys_idPath": [
                54
            ],
            "_sys_lastModifiedAt": [
                31
            ],
            "_sys_slug": [
                54
            ],
            "_sys_slugPath": [
                54
            ],
            "_sys_title": [
                54
            ],
            "__typename": [
                53
            ]
        },
        "CategoriesItemOrderByEnum": {},
        "CodeSnippetLanguage": {},
        "DateFilter": {
            "eq": [
                32
            ],
            "isAfter": [
                32
            ],
            "isBefore": [
                32
            ],
            "neq": [
                32
            ],
            "onOrAfter": [
                32
            ],
            "onOrBefore": [
                32
            ],
            "__typename": [
                53
            ]
        },
        "DateTime": {},
        "Float": {},
        "ID": {},
        "Int": {},
        "JSON": {},
        "LegalPages": {
            "_analyticsKey": [
                53,
                {
                    "scope": [
                        0
                    ]
                }
            ],
            "_id": [
                53
            ],
            "_idPath": [
                53
            ],
            "_meta": [
                42
            ],
            "_searchKey": [
                53
            ],
            "_slug": [
                53
            ],
            "_slugPath": [
                53
            ],
            "_sys": [
                13
            ],
            "_title": [
                53
            ],
            "items": [
                38
            ],
            "__typename": [
                53
            ]
        },
        "LegalPagesItem": {
            "_analyticsKey": [
                53,
                {
                    "scope": [
                        0
                    ]
                }
            ],
            "_id": [
                53
            ],
            "_idPath": [
                53
            ],
            "_slug": [
                53
            ],
            "_slugPath": [
                53
            ],
            "_sys": [
                13
            ],
            "_title": [
                53
            ],
            "body": [
                23
            ],
            "description": [
                53
            ],
            "__typename": [
                53
            ]
        },
        "LegalPagesItemFilterInput": {
            "AND": [
                39
            ],
            "OR": [
                39
            ],
            "_sys_apiNamePath": [
                54
            ],
            "_sys_createdAt": [
                31
            ],
            "_sys_hash": [
                54
            ],
            "_sys_id": [
                54
            ],
            "_sys_idPath": [
                54
            ],
            "_sys_lastModifiedAt": [
                31
            ],
            "_sys_slug": [
                54
            ],
            "_sys_slugPath": [
                54
            ],
            "_sys_title": [
                54
            ],
            "description": [
                54
            ],
            "__typename": [
                53
            ]
        },
        "LegalPagesItemOrderByEnum": {},
        "ListFilter": {
            "isEmpty": [
                25
            ],
            "length": [
                35
            ],
            "__typename": [
                53
            ]
        },
        "ListMeta": {
            "totalCount": [
                35
            ],
            "__typename": [
                53
            ]
        },
        "NumberFilter": {
            "eq": [
                33
            ],
            "gt": [
                33
            ],
            "gte": [
                33
            ],
            "lt": [
                33
            ],
            "lte": [
                33
            ],
            "neq": [
                33
            ],
            "__typename": [
                53
            ]
        },
        "Posts": {
            "_analyticsKey": [
                53,
                {
                    "scope": [
                        0
                    ]
                }
            ],
            "_id": [
                53
            ],
            "_idPath": [
                53
            ],
            "_meta": [
                42
            ],
            "_searchKey": [
                53
            ],
            "_slug": [
                53
            ],
            "_slugPath": [
                53
            ],
            "_sys": [
                13
            ],
            "_title": [
                53
            ],
            "items": [
                45
            ],
            "__typename": [
                53
            ]
        },
        "PostsItem": {
            "_analyticsKey": [
                53,
                {
                    "scope": [
                        0
                    ]
                }
            ],
            "_id": [
                53
            ],
            "_idPath": [
                53
            ],
            "_slug": [
                53
            ],
            "_slugPath": [
                53
            ],
            "_sys": [
                13
            ],
            "_title": [
                53
            ],
            "authors": [
                2
            ],
            "body": [
                21
            ],
            "categories": [
                27
            ],
            "date": [
                53
            ],
            "description": [
                53
            ],
            "image": [
                15
            ],
            "__typename": [
                53
            ]
        },
        "PostsItemFilterInput": {
            "AND": [
                46
            ],
            "OR": [
                46
            ],
            "_sys_apiNamePath": [
                54
            ],
            "_sys_createdAt": [
                31
            ],
            "_sys_hash": [
                54
            ],
            "_sys_id": [
                54
            ],
            "_sys_idPath": [
                54
            ],
            "_sys_lastModifiedAt": [
                31
            ],
            "_sys_slug": [
                54
            ],
            "_sys_slugPath": [
                54
            ],
            "_sys_title": [
                54
            ],
            "authors": [
                47
            ],
            "categories": [
                48
            ],
            "date": [
                31
            ],
            "description": [
                54
            ],
            "__typename": [
                53
            ]
        },
        "PostsItemFilterInput__authors_0___untitled": {
            "_sys_apiNamePath": [
                54
            ],
            "_sys_createdAt": [
                31
            ],
            "_sys_hash": [
                54
            ],
            "_sys_id": [
                54
            ],
            "_sys_idPath": [
                54
            ],
            "_sys_lastModifiedAt": [
                31
            ],
            "_sys_slug": [
                54
            ],
            "_sys_slugPath": [
                54
            ],
            "_sys_title": [
                54
            ],
            "xUrl": [
                54
            ],
            "__typename": [
                53
            ]
        },
        "PostsItemFilterInput__categories_0___untitled": {
            "_sys_apiNamePath": [
                54
            ],
            "_sys_createdAt": [
                31
            ],
            "_sys_hash": [
                54
            ],
            "_sys_id": [
                54
            ],
            "_sys_idPath": [
                54
            ],
            "_sys_lastModifiedAt": [
                31
            ],
            "_sys_slug": [
                54
            ],
            "_sys_slugPath": [
                54
            ],
            "_sys_title": [
                54
            ],
            "__typename": [
                53
            ]
        },
        "PostsItemOrderByEnum": {},
        "Query": {
            "_componentInstances": [
                57
            ],
            "_sys": [
                51
            ],
            "blog": [
                20
            ],
            "legalPages": [
                37,
                {
                    "filter": [
                        39
                    ],
                    "first": [
                        35
                    ],
                    "orderBy": [
                        40
                    ],
                    "skip": [
                        35
                    ]
                }
            ],
            "__typename": [
                53
            ]
        },
        "RepoSys": {
            "hash": [
                53
            ],
            "id": [
                34
            ],
            "slug": [
                53
            ],
            "title": [
                53
            ],
            "__typename": [
                53
            ]
        },
        "RichTextJson": {
            "content": [
                6
            ],
            "toc": [
                7
            ],
            "on_BaseRichTextJson": [
                8
            ],
            "on_BodyRichText": [
                22
            ],
            "on_Body_1RichText": [
                24
            ],
            "__typename": [
                53
            ]
        },
        "String": {},
        "StringFilter": {
            "contains": [
                53
            ],
            "endsWith": [
                53
            ],
            "eq": [
                53
            ],
            "matches": [
                55
            ],
            "notEq": [
                53
            ],
            "startsWith": [
                53
            ],
            "__typename": [
                53
            ]
        },
        "StringMatchesFilter": {
            "caseSensitive": [
                25
            ],
            "pattern": [
                53
            ],
            "__typename": [
                53
            ]
        },
        "Variant": {
            "apiName": [
                53
            ],
            "color": [
                53
            ],
            "id": [
                53
            ],
            "isDefault": [
                25
            ],
            "label": [
                53
            ],
            "__typename": [
                53
            ]
        },
        "_components": {
            "authorsItem": [
                1,
                {
                    "filter": [
                        3
                    ],
                    "first": [
                        35
                    ],
                    "orderBy": [
                        4
                    ],
                    "skip": [
                        35
                    ]
                }
            ],
            "categoriesItem": [
                26,
                {
                    "filter": [
                        28
                    ],
                    "first": [
                        35
                    ],
                    "orderBy": [
                        29
                    ],
                    "skip": [
                        35
                    ]
                }
            ],
            "legalPagesItem": [
                37,
                {
                    "filter": [
                        39
                    ],
                    "first": [
                        35
                    ],
                    "orderBy": [
                        40
                    ],
                    "skip": [
                        35
                    ]
                }
            ],
            "postsItem": [
                44,
                {
                    "filter": [
                        46
                    ],
                    "first": [
                        35
                    ],
                    "orderBy": [
                        49
                    ],
                    "skip": [
                        35
                    ]
                }
            ],
            "__typename": [
                53
            ]
        }
    }
}