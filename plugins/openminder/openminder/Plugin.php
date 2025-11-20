<?php namespace OpenMinder\OpenMinder;

use System\Classes\PluginBase;

/**
 * Plugin Information File
 *
 * @link https://docs.octobercms.com/3.x/extend/system/plugins.html
 */
class Plugin extends PluginBase
{
    /**
     * pluginDetails about this plugin.
     */
    public function pluginDetails()
    {
        return [
            'name' => 'OpenMinder',
            'description' => 'No description provided yet...',
            'author' => 'OpenMinder',
            'icon' => 'icon-leaf'
        ];
    }

    public function registerComponents()
    {
        return [
            'OpenMinder\OpenMinder\Components\OpenMinder' => 'OpenMinder',
        ];
    }

    public function registerMarkupTags()
    {
        return [
            'functions' => [
                'get' => 'get'
            ]
        ];
    }
}
