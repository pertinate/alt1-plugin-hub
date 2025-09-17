import { api } from '~/trpc/react';
import { Button } from './ui/button';

type Props = {
    id: number;
};

export default function DeletePluginBtn(props: Props) {
    const utils = api.useUtils();
    const deleteMutation = api.plugin.deletePlugin.useMutation();
    return (
        <Button
            variant={'destructive'}
            onClick={() => {
                deleteMutation
                    .mutateAsync(props.id)
                    .then(() => {
                        utils.plugin.invalidate();
                    })
                    .catch(console.error);
            }}
            disabled={deleteMutation.isPending}
        >
            Delete
        </Button>
    );
}
