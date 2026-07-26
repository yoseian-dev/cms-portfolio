<script setup lang="ts">
import type { EditorToolbarItem } from '@nuxt/ui'

const content = defineModel<string>('modelValue', { default: '' })

const items: EditorToolbarItem[][] = [
    [
        {
            kind: 'undo',
            icon: 'i-lucide-undo',
            tooltip: { text: '元に戻す' }
        },
        {
            kind: 'redo',
            icon: 'i-lucide-redo',
            tooltip: { text: 'やり直す' }
        }
    ],
    [
        {
            icon: 'i-lucide-heading',
            tooltip: { text: '見出し' },
            content: {
                align: 'start'
            },
            items: [
                {
                    kind: 'heading',
                    level: 1,
                    icon: 'i-lucide-heading-1',
                    label: '見出し1'
                },
                {
                    kind: 'heading',
                    level: 2,
                    icon: 'i-lucide-heading-2',
                    label: '見出し2'
                },
                {
                    kind: 'heading',
                    level: 3,
                    icon: 'i-lucide-heading-3',
                    label: '見出し3'
                }
            ]
        },
        {
            icon: 'i-lucide-list',
            tooltip: { text: 'リスト' },
            content: {
                align: 'start'
            },
            items: [
                {
                    kind: 'bulletList',
                    icon: 'i-lucide-list',
                    label: '箇条書き'
                },
                {
                    kind: 'orderedList',
                    icon: 'i-lucide-list-ordered',
                    label: '番号付きリスト'
                }
            ]
        },
        {
            kind: 'blockquote',
            icon: 'i-lucide-text-quote',
            tooltip: { text: '引用' }
        },
        {
            kind: 'codeBlock',
            icon: 'i-lucide-square-code',
            tooltip: { text: 'コードブロック' }
        },
        {
            kind: 'horizontalRule',
            icon: 'i-lucide-separator-horizontal',
            tooltip: { text: '区切り線' }
        }
    ],
    [
        {
            kind: 'mark',
            mark: 'bold',
            icon: 'i-lucide-bold',
            tooltip: { text: '太字' }
        },
        {
            kind: 'mark',
            mark: 'italic',
            icon: 'i-lucide-italic',
            tooltip: { text: '斜体' }
        },
        {
            kind: 'mark',
            mark: 'strike',
            icon: 'i-lucide-strikethrough',
            tooltip: { text: '取り消し線' }
        },
        {
            kind: 'mark',
            mark: 'code',
            icon: 'i-lucide-code',
            tooltip: { text: 'インラインコード' }
        }
    ],
    [
        {
            kind: 'link',
            icon: 'i-lucide-link',
            tooltip: { text: 'リンク' }
        }
    ]
]
</script>

<template>
    <UEditor v-slot="{ editor }" v-model="content" content-type="markdown" placeholder="記事本文を入力してください"
        class="min-h-96 w-full overflow-hidden rounded-md border border-default" :ui="{
            base: [
                '*:my-0',
                '*:first:mt-0',
                '*:last:mb-0',
                '[&_h1]:mt-5 [&_h1]:mb-2',
                '[&_h2]:mt-4 [&_h2]:mb-2',
                '[&_h3]:mt-3 [&_h3]:mb-2',
                'min-h-80 p-4'
            ]
        }">
        <UEditorToolbar :editor="editor" :items="items" class="overflow-x-auto border-b border-default p-2" />
    </UEditor>
</template>