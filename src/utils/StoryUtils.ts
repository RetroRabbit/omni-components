import { html as langHtml, TagSpec } from '@codemirror/lang-html';
import { javascript } from '@codemirror/lang-javascript';
import { githubDark } from '@ddietr/codemirror-themes/github-dark.js';
import { Package, ClassDeclaration, CustomElementDeclaration, Declaration, CustomElement } from 'custom-elements-manifest/schema';
import { html } from 'lit';
import { render } from 'lit-html';

/* eslint-disable @typescript-eslint/no-explicit-any */
const codeSnippet = '```';

function loadCssProperties(
    element: string,
    customElements: Package,
    cssDeclarations: Record<
        string,
        {
            control: 'color' | 'text';
            description: string;
            category: string;
            subcategory: string;
            value: string;
        }
    > = undefined
) {
    if (!cssDeclarations) {
        cssDeclarations = {};
    }

    const elementModule = JSON.parse(
        JSON.stringify(customElements.modules.find((module) => module.exports.find((e: { name: string }) => e.name === element)))
    );

    let superModule = elementModule;
    do {
        if (superModule.declarations.find((sd: any) => sd.superclass)) {
            superModule = customElements.modules.find((module) =>
                module.exports.find(
                    (e) =>
                        e.name ===
                        (superModule.declarations.find((sd: Declaration) => (sd as ClassDeclaration).superclass) as ClassDeclaration)
                            .superclass.name
                )
            );
        } else {
            superModule = undefined;
        }
        if (superModule) {
            elementModule.declarations = [...superModule.declarations, ...elementModule.declarations];
        }
    } while (superModule);
    for (const key in elementModule.declarations) {
        const declaration = elementModule.declarations[key] as CustomElementDeclaration &
            CustomElement & {
                cssCategory: string;
            };
        const cssCategory = declaration.cssCategory;
        if (declaration.cssProperties && declaration.cssProperties.length > 0) {
            for (const cssKey in declaration.cssProperties) {
                const cssProperty = declaration.cssProperties[cssKey];
                if (!cssDeclarations[cssProperty.name.replace('--', '')]) {
                    cssDeclarations[cssProperty.name.replace('--', '')] = {
                        control:
                            cssProperty.name.endsWith('color') || cssProperty.name.endsWith('colour') || cssProperty.name.endsWith('fill')
                                ? 'color'
                                : 'text',
                        description: cssProperty.description,
                        category: 'CSS Variables',
                        subcategory: cssCategory ?? 'Component Variables',
                        value: ''
                    };
                } else {
                    cssDeclarations[cssProperty.name.replace('--', '')].subcategory = 'Component Variables';
                }
            }
        }
    }

    return cssDeclarations;
}

// function loadThemeVariablesRemote() {
//     const themeVariables = loadCssPropertiesRemote('OmniElement');
//     return themeVariables;
// }

// function loadCssPropertiesRemote(element: string, cssDeclarations: any = undefined): any {
//     if (!cssDeclarations) {
//         cssDeclarations = {};
//     }

//     let error = undefined;
//     let output = '';
//     const request = new XMLHttpRequest();
//     request.open('GET', 'custom-elements.json', false); // `false` makes the request synchronous
//     request.onload = () => {
//         output = request.responseText;
//     };
//     request.onerror = () => {
//         error = request.status;
//     };
//     request.send(null);

//     if (error) {
//         return cssDeclarations;
//     }

//     const customElements = JSON.parse(output);

//     cssDeclarations = loadCssProperties(element, customElements, cssDeclarations);

//     // console.log(element, cssDeclarations);
//     return cssDeclarations;
// }

// function loadCustomElementsRemote(): any {
//     let error = undefined;
//     let output = '';
//     const request = new XMLHttpRequest();
//     request.open('GET', 'custom-elements.json', false); // `false` makes the request synchronous
//     request.onload = () => {
//         output = request.responseText;
//     };
//     request.onerror = () => {
//         error = `${request.status} - ${request.statusText}`;
//     };
//     request.send(null);

//     if (error) {
//         throw new Error(error);
//     }

//     const customElements = JSON.parse(output);

//     return customElements;
// }

function loadCustomElementsModuleByFileFor(moduleName: string, customElements: Package) {
    return customElements.modules.find((module: any) => module.path.endsWith(`${moduleName}.ts`));
}

function loadCustomElementsModuleFor(elementName: string, customElements: Package) {
    return customElements.modules.find((module: any) =>
        module.declarations.find((d: any) => (d.tagName === elementName && d.customElement) || d.name === elementName)
    );
}

// function loadCustomElementsModuleForRemote(elementName: string) {
//     const customElements = loadCustomElementsRemote();
//     return loadCustomElementsModuleFor(elementName, customElements);
// }

function loadSlotFor(elementName: string, slotName: string, customElements: Package) {
    const module = loadCustomElementsModuleFor(elementName, customElements);
    return loadSlotForModule(module, slotName);
}

// function loadSlotForRemote(elementName: string, slotName: string) {
//     const module = loadCustomElementsModuleForRemote(elementName);
//     return loadSlotForModule(module, slotName);
// }

function loadSlotForModule(elementModule: any, slotName: string): { name: string; description: string } {
    const declaration = elementModule.declarations.find(
        (d: any) => d.slots && d.slots.length > 0 && d.slots.find((s: any) => s.name === slotName)
    );
    if (declaration) {
        const slot = declaration.slots.find((s: any) => s.name === slotName);
        if (slot) {
            return {
                name: slot.name,
                description: formatMarkdownCodeElements(filterJsDocLinks(slot.description))
            };
        }
    }
    return undefined;
}

function loadDefaultSlotFor(elementName: string, customElements: Package) {
    const module = loadCustomElementsModuleFor(elementName, customElements);
    return loadDefaultSlotForModule(module);
}

// function loadDefaultSlotForRemote(elementName: string) {
//     const module = loadCustomElementsModuleForRemote(elementName);
//     return loadDefaultSlotForModule(module);
// }

function loadDefaultSlotForModule(elementModule: any) {
    return loadSlotForModule(elementModule, '');
}

function assignToSlot(slotName: string, rawHtml: string) {
    if (!rawHtml || !slotName) return rawHtml;

    const parser = new DOMParser();

    const doc = parser.parseFromString(`<main>${rawHtml}</main>`, 'text/xml');
    const errorNode = doc.querySelector('parsererror');
    if (errorNode) {
        // parsing failed
        return rawHtml;
    }

    // parsing succeeded
    const serializer = new XMLSerializer();
    let newHtml = '';

    for (let index = 0; index < doc.documentElement.childElementCount; index++) {
        const element = doc.documentElement.children[index];
        element.removeAttribute('slot');
        element.setAttribute('slot', slotName);
        if (newHtml) {
            newHtml += '\r\n';
        }
        newHtml += serializer.serializeToString(element);
    }

    rawHtml = newHtml;

    return rawHtml;
}

function markdownCode(code: string, lang: string = '') {
    const md = `

\`\`\`{lang}

{code}

\`\`\`

  `
        .replace('{lang}', lang)
        .replace('{code}', code);

    return md;
}

// function markdownCodeRemote(src: string, lang: string = '') {
//     let error = undefined;
//     let output = '';
//     const request = new XMLHttpRequest();
//     request.open('GET', src, false); // `false` makes the request synchronous
//     request.onload = () => {
//         output = request.responseText;
//     };
//     request.onerror = () => {
//         error = `${request.status} - ${request.statusText}`;
//     };
//     request.send(null);

//     if (error) {
//         throw new Error(error);
//     }

//     return markdownCode(output, lang);
// }

async function loadFileRemote(src: string) {
    const response = await fetch(src);
    const output = await response.text();

    return output;
}

async function loadThemesListRemote() {
    const response = await fetch('/themes-list.json');
    const list = await response.json();

    return list.themes;
}

function formatMarkdownCodeElements(str: string, lang: string = 'js') {
    if (!str) {
        return str;
    }
    return str.replaceAll(`${codeSnippet}`, `\r\n${codeSnippet}`).replaceAll(`${codeSnippet}${lang}`, `${codeSnippet}${lang}\r\n`);
}

function markdownCodeToHtml(str: string, lang: string = 'js') {
    if (!str) {
        return str;
    }
    return str.replaceAll(`${codeSnippet}${lang}`, `<pre><code data-language="${lang}">`).replaceAll(`${codeSnippet}`, `</code></pre>`);
}

function enhanceCodeBlocks(parent: Element) {
    if (!parent) {
        parent = document.body;
    }

    const codeBlocks = parent.querySelectorAll('code');
    codeBlocks.forEach((codeBlock) => {
        let codeLines = codeBlock.innerHTML.split('\n');
        let code = '';
        for (let index = 0; index < codeLines.length; index++) {
            const line = codeLines[index];
            if (code || (line && line !== '\n')) {
                if (!code) {
                    code = line;
                } else {
                    code += `\n${line}`;
                }
            }
        }
        codeLines = code.split('\n');
        code = '';
        for (let index = codeLines.length - 1; index >= 0; index--) {
            const line = codeLines[index];
            if (code || (line && line !== '\n')) {
                if (!code) {
                    code = line;
                } else {
                    code += `\n${line}`;
                }
            }
        }
        const language = codeBlock.attributes.getNamedItem('data-language');
        if (codeBlock.parentElement.tagName === `pre`) {
            codeBlock = codeBlock.parentElement;
        }
        codeBlock.insertAdjacentHTML('beforebegin', '<div></div>');
        const codeContainer = codeBlock.previousSibling as HTMLElement;

        render(
            html` <omni-code-mirror
                .extensions="${() => [
                    githubDark,
                    language && (language.value === 'js' || language.value === 'javascript') ? javascript() : langHtml()
                ]}"
                .code="${code}"
                read-only>
            </omni-code-mirror>`,
            codeContainer
        );
        codeBlock.parentElement.removeChild(codeBlock);
    });
}

let _completions: {
    /**
    Add additional tags that can be completed.
    */
    extraTags?: Record<string, TagSpec>;
    /**
    Add additional completable attributes to all tags.
    */
    extraGlobalAttributes?: Record<string, null | readonly string[]>;
} = null;
function loadCustomElementsCodeMirrorCompletions(customElements: Package) {
    if (!_completions) {
        const extraTags: Record<string, TagSpec> = {};
        const extraGlobalAttributes: Record<string, null | string[]> = {};

        customElements.modules.forEach((module) => {
            const elementExport = module.exports.find((e) => e.kind === 'custom-element-definition');
            if (elementExport) {
                module.declarations.forEach((d) => {
                    const declaration = d as CustomElement;
                    if (declaration.slots) {
                        declaration.slots.forEach((slot) => {
                            if (slot.name && slot.name !== '[Default Slot]') {
                                if (!extraGlobalAttributes.slot) {
                                    extraGlobalAttributes.slot = [];
                                }
                                if (!extraGlobalAttributes.slot.includes(slot.name)) {
                                    extraGlobalAttributes.slot.push(slot.name);
                                }
                            }
                        });
                    }

                    if (declaration.tagName) {
                        const attrs: Record<string, string[]> = {};
                        if (declaration.attributes) {
                            declaration.attributes.forEach((attribute) => {
                                let attrValues: string[] = null;
                                if (
                                    attribute.type.text !== 'string' &&
                                    attribute.type.text !== 'boolean' &&
                                    !attribute.type.text.includes('Promise')
                                ) {
                                    const types = attribute.type.text.split(' | ');
                                    attrValues = [];
                                    for (const type in types) {
                                        const typeValue = types[type];
                                        attrValues.push(typeValue.substring(1, typeValue.length - 1));
                                    }
                                }
                                attrs[attribute.name] = attrValues;
                            });
                        }

                        if (!extraTags[declaration.tagName] && declaration.tagName.startsWith('omni-')) {
                            extraTags[declaration.tagName] = {
                                attrs: attrs
                            };
                        }
                    }
                });
            }
        });

        _completions = {
            extraTags: extraTags,
            extraGlobalAttributes: extraGlobalAttributes
        };
    }
    return _completions;
}

async function loadCustomElementsCodeMirrorCompletionsRemote(path = '/custom-elements.json') {
    if (!_completions) {
        const customElements = await loadCustomElements(path);
        return loadCustomElementsCodeMirrorCompletions(customElements);
    }
    return _completions;
}

async function loadCustomElements(path = '/custom-elements.json') {
    const response = await fetch(path);
    const customElements = await response.json();
    return customElements as Package;
}

function filterJsDocLinks(jsdoc: string) {
    if (!jsdoc) return jsdoc;

    const renderLink = (link: { tag: string; text: string; url: string; raw: string }) => {
        if (!link.url.includes(':')) {
            // Local markdown links are not valid
            return `**${link.text}**`;
        }
        return `[${link.text}](${link.url}`;
    };

    const matches = Array.from(jsdoc.matchAll(/(?:\[(.*?)\])?{@(link|tutorial) (.*?)(?:(?:\|| +)(.*?))?}/gm));

    if (!matches) return jsdoc;

    for (const match of matches) {
        const tag = match[2].trim();
        const url = match[3].trim();
        let text = url;

        if (match[4]) {
            text = match[4].trim();
        } else if (match[1]) {
            text = match[1].trim();
        }

        jsdoc = jsdoc.replace(match[0], renderLink({ tag, url, text, raw: match[0] }));
    }

    return jsdoc;
}

/**
 * Interprets a template literal as a raw HTML string.
 *
 * ```ts
 * const header = (title: string) => raw`<h1>${title}</h1>`;
 * ```
 *
 * The `raw` tag returns a string that can be used directly as ```innerHTML``` or as ```unsafeHTML``` via lit.
 */
const raw = (strings: TemplateStringsArray, ...values: unknown[]) => asRenderString(strings, values);

const asRenderString = (strings: TemplateStringsArray, values: unknown[]): string => {
    // eslint-disable-next-line no-useless-catch
    try {
        const v: any = [...values, ''].map((e) => {
            switch (typeof e) {
                case 'object': {
                    return asRenderString((e as any).strings || [], (e as any).values || []);
                }
                default:
                    return e;
            }
        });
        if (strings.length === 0 && values.length > 0) {
            if (typeof values[0] === 'object' && (values[0] as any).strings) {
                return asRenderString((values[0] as any).strings || [], (values[0] as any).values || []);
            }
            return values[0] as string;
        }
        return strings.reduce((acc, s, i) => {
            if (!v[i]) {
                return acc + s;
            }
            return acc + s + v[i].toString();
        }, '');
    } catch (error) {
        throw error;
    }
};

function querySelectorAsync(parent: Element | ShadowRoot, selector: any, checkFrequencyMs: number = 500, timeoutMs: number = 1) {
    return new Promise((resolve, reject) => {
        let element = parent.querySelector(selector);
        if (element) {
            return resolve(element);
        }

        const startTimeInMs = Date.now();
        (function loopSearch() {
            element = parent.querySelector(selector);
            if (element) {
                resolve(element);
            } else {
                setTimeout(function () {
                    if (timeoutMs && Date.now() - startTimeInMs > timeoutMs) {
                        try {
                            reject(
                                new Error(
                                    `Timed out waiting for query (${selector}) in ${timeoutMs} ms \n\n${parent.toString()} - ${
                                        parent.nodeName
                                    } - ${parent.nodeValue} \n${
                                        parent.parentElement ? parent.parentElement.innerHTML : parent.textContent
                                    } \n${parent.innerHTML}`
                                )
                            );
                        } catch (_) {
                            reject(new Error(`Timed out waiting for query (${selector}) in ${timeoutMs} ms \n${_.toString()}`));
                        }
                    } else {
                        loopSearch();
                    }
                }, checkFrequencyMs);
            }
        })();
    });
}

async function setupThemes() {
    const themes = await loadThemesListRemote();
    const themeSelect = document.getElementById('header-theme-select') as HTMLSelectElement;
    const themeStyle = document.getElementById('theme-styles') as HTMLStyleElement;
    const themeStorageKey = 'omni-docs-theme-selection';
    const customThemeCssKey = 'omni-docs-custom-theme-css';
    const customThemeKey = 'Custom Theme';
    const noThemeKey = 'No Theme';

    function addOption(key: string) {
        const option = document.createElement('option');
        option.text = key;
        if (window.sessionStorage.getItem(themeStorageKey) === key) {
            option.selected = true;
            changeTheme(key);
        }
        themeSelect.add(option);
        return option;
    }

    function changeTheme(theme: string) {
        if (theme === noThemeKey) {
            themeStyle.innerHTML = '';
            return;
        }
        if (theme === customThemeKey) {
            const customCss = window.sessionStorage.getItem(customThemeCssKey);
            themeStyle.innerHTML = customCss;
            return;
        }
        const css = themeStyle.sheet;
        loadFileRemote(`/themes/${theme}`).then(
            (cssText) => {
                themeStyle.innerHTML = cssText;
            },
            (error) => {
                console.error(error);
            }
        );
    }

    addOption(noThemeKey);
    themes.forEach((theme: string) => {
        addOption(theme);
    });
    addOption(customThemeKey);

    themeSelect.addEventListener('change', (e) => {
        const value = (e.target as HTMLSelectElement).value;
        changeTheme(value);
        window.sessionStorage.setItem(themeStorageKey, value);
    });
}

async function setupEleventy() {
    function openTab(target: Element, tabId: string) {
        let i;

        // Get all elements with class="tabcontent" and hide them
        const tabContent = document.getElementsByClassName('component-tab') as HTMLCollectionOf<HTMLElement>;
        for (i = 0; i < tabContent.length; i++) {
            tabContent[i].style.display = 'none';
        }

        // Get all elements with class="tablinks" and remove the class "active"
        const tabLinks = document.getElementsByClassName('component-tab-button');
        for (i = 0; i < tabLinks.length; i++) {
            tabLinks[i].classList.remove('active');
        }

        // Show the current tab, and add an "active" class to the button that opened the tab
        document.getElementById(tabId).style.display = 'block';
        target.classList.add('active');

        // Set nav state of tab.
        window.history.replaceState({}, '', `?tab=${tabId}`);
    }

    function copyToClipboard(id: string) {
        const range = document.createRange();
        range.selectNode(document.getElementById(id));
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
    }

    // Add functions for DOM access
    const windowAny = window as any;
    windowAny.copyToClipboard = copyToClipboard;
    windowAny.openTab = openTab;

    // Open / Close the menu
    const menuButton = document.querySelector<HTMLElement>('.header-menu-button .material-icons');
    menuButton.addEventListener('click', (e) => {
        const nav = document.querySelector('nav');
        if (nav.classList.contains('mobile')) {
            nav.classList.remove('mobile');
            menuButton.innerText = 'menu';
        } else {
            nav.classList.add('mobile');
            menuButton.innerText = 'close';
        }
    });

    // Scroll highlight
    const storyRenderers = document.querySelectorAll<HTMLElement>('story-renderer');
    const tocAnchors = document.querySelectorAll('.component-toc a');

    window.addEventListener('scroll', () => {
        storyRenderers.forEach((sr) => {
            const top = window.scrollY;
            const offset = sr.offsetTop + 65;
            const height = sr.offsetHeight;
            const id = sr.getAttribute('id');

            if (top > offset && top < offset + height) {
                // console.log(id, top, offset, height);

                tocAnchors.forEach((a) => {
                    a.classList.remove('component-toc-active');
                    document.querySelector(`.component-toc a[href*='${id}']`).classList.add('component-toc-active');
                });
            }
        });
    });

    // Open tab from query string.
    if (document.location.pathname !== '/' && document.location.search) {
        const searchParams = new URLSearchParams(document.location.search);

        for (const param of searchParams) {
            switch (param[0]) {
                case 'tab': {
                    const id = param[1];
                    const target = document.querySelector(`[data-name="${id}"]`);
                    openTab(target, id);
                    break;
                }
                default:
                    break;
            }
        }
    }

    // Toggle loading indicator off on page load.
    const overlay = document.querySelector<HTMLElement>('.component-overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
    const component = document.querySelector<HTMLElement>('.component');
    if (component) {
        component.style.display = 'block';
    }

    await setupThemes();
}

export type PlayFunctionContext<T> = {
    args: T;
    story: ComponentStoryFormat<T>;
    canvasElement: HTMLElement;
};

export type PlayFunction<T> = (context: PlayFunctionContext<T>) => Promise<void> | void;

export type ComponentStoryFormat<T> = {
    render?: (args: T) => any;
    name?: string;
    args?: Partial<T>;
    play?: PlayFunction<T>;
    source?: () => string;
};

export type CSFIdentifier = {
    title: string;
    component: string;
};

export {
    // loadCustomElementsRemote,
    loadCustomElements,
    loadCustomElementsModuleByFileFor,
    loadCustomElementsModuleFor,
    loadCustomElementsCodeMirrorCompletions,
    loadCustomElementsCodeMirrorCompletionsRemote,
    // loadCustomElementsModuleForRemote,
    loadSlotFor,
    loadSlotForModule,
    // loadSlotForRemote,
    loadDefaultSlotFor,
    // loadDefaultSlotForRemote,
    loadDefaultSlotForModule,
    // loadCssPropertiesRemote,
    loadCssProperties,
    // loadThemeVariablesRemote,
    loadFileRemote,
    markdownCode,
    // markdownCodeRemote,
    loadThemesListRemote,
    asRenderString,
    filterJsDocLinks,
    formatMarkdownCodeElements,
    markdownCodeToHtml,
    assignToSlot,
    enhanceCodeBlocks,
    raw,
    querySelectorAsync,
    setupThemes,
    setupEleventy
};
