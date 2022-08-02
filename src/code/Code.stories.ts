import { html, TemplateResult } from 'lit';
import { Story, Meta, WebComponentsFramework } from '@storybook/web-components';
import { expect, jest } from '@storybook/jest';
import { within, userEvent } from '@storybook/testing-library';

import './Code.js';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'UI Components/Code',
  component: "omni-code",
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
  },
	parameters: {
	}
} as Meta;

interface ArgTypes {
	header: string;
	content: string;
	language: string;
}

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: Story<ArgTypes> = (args: ArgTypes) => html`
    <omni-code 
    language="${args.language}" 
    data-testid="test-code"
    header="${args.header}" 
    content="${args.content}" 
    >
    </omni-code>
`;

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.storyName = "Default"
Default.parameters = {
};
Default.args = {
  header:'' ,
  content:'Hello' ,
  language:'html' ,
};
Default.play = async (context) => {
  
  const canvas = within(context.canvasElement);

  const Code = canvas.getByTestId(`test-code`);
  console.log(Code);
  const valueChange = jest.fn();
  Code.addEventListener('value-change',()=> valueChange());

  const content = Code.shadowRoot.getElementById(`content`);
  console.log(content);

  await userEvent.click(content);
  await userEvent.click(content);
  await expect(valueChange).toBeCalledTimes(2);
}

// export const Header = Template.bind({});
// Header.args = {
//   header:'Header' ,
//   content:'' ,
//   language:'' ,
// };

export const HTML_as_content = Template.bind({});
HTML_as_content.args = {
  header:'HTML' ,
  content:`  
   <div>
     <h1>Hello World</h1>
   </div>
  ` ,
  language:'html' ,
};


// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template2: Story<ArgTypes> = (args: ArgTypes) => html`
    <omni-code 
    language="${args.language}" 
    data-testid="test-code"
    header="${args.header}" 
    content="${args.content}" 
    >
    <div>
      <h1>Hello World</h1>
    </div>
    </omni-code>
`;
export const HTML_as_child_element = Template2.bind({});
HTML_as_child_element.args = {
  header:'HTML as child element' ,
  language:'html' ,
};

export const JavaScript = Template.bind({});
JavaScript.args = {
  header:'JavaScript' ,
  content:`  
    alert('this is javascript');
  ` ,
  language:'javascript' ,
};