<?php namespace OpenMinder\OpenMinder\Components;

use Flash;
use Cache;
use Exception;
use Validator;
use ValidationException;
use Carbon\Carbon;
use GuzzleHttp\Client;
use Cms\Classes\ComponentBase;

class OpenMinder extends ComponentBase
{
    private $request;

    public function componentDetails()
    {
        return [
            'name'        => 'OpenMinder',
            'description' => 'No description provided yet...'
        ];
    }

    public function init()
    {
        $this->request = request();
    }

    public function onRun()
    {
        $this->addCss('/plugins/openminder/openminder/assets/css/bootstrap.min.css');
    }

    public function onRender()
    {
        if ($course_id = $this->param('course_id')) {
            $course = Cache::remember("smartline_openminder_courses_$course_id", 1440, function () use ($course_id) {
                $client = new Client;

                $request = $client->get("https://openminder.ru/api/v1/smartline/courses/$course_id");

                return json_decode($request->getBody()->getContents());
            });

            return $this->renderPartial('@course', [
                'course' => $course,
            ]);
        }

        $categories = Cache::remember("smartline_openminder_categories", Carbon::now()->endOfHour(), function() {
            $client = new Client;

            $request = $client->get('https://openminder.ru/api/v1/smartline/categories');

            return json_decode($request->getBody()->getContents());
        });

        $courses = Cache::remember("smartline_openminder_courses", Carbon::now()->endOfHour(), function() {
            $client = new Client;

            $request = $client->get('https://openminder.ru/api/v1/smartline/courses');

            return json_decode($request->getBody()->getContents());
        });

        $response = [];

        foreach ($courses as $course) {
            if ($this->request->categories) {
                if (in_array($course->category_id, $this->request->categories)) {
                    $response[] = $course;
                }

                continue;
            }

            $response[] = $course;
        }

        return $this->renderPartial('@default', [
            'courses' => $response,
            'categories' => $categories,
        ]);
    }

    public function onBuy()
    {
        $validation = Validator::make($this->request->all(), [
            'email' => 'required|email',
        ], [
            'email.required' => 'Укажите электронну почту',
            'email.email' => 'Укажите электронну почту в правильном формате',
        ]);

        if ($validation->fails()) {
            throw new ValidationException($validation);
        }

        return true;

        if (!$course_id = $this->param('course_id')) {
            return null;
        }

        $client = new Client;

        try {
            $request = $client->get('https://openminder.ru/api/v1/smartline/pay', [
                'query' => [
                    'email' => $this->request->email,
                    'course_id' => $this->param('course_id'),
                ]
            ]);

            $response = $request->getBody()->getContents();
        }
        catch (Exception $e) {
            Flash::error($e->getMessage());
            return null;
        }

        return redirect()->to($response);
    }
}
